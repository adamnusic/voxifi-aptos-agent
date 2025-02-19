import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentRuntime, LocalSigner, createAptosTools } from "test-agent-kit-2";
import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { StreamingTextResponse } from "ai";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { FetchAudioUrlTool } from "./tools";

const llm = new ChatGroq({
  temperature: 0.7,
  model: "llama3-8b-8192",
});

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

export async function POST(request: Request) {
  try {
    // Initialize Aptos configuration
    const aptosConfig = new AptosConfig({
      network: Network.TESTNET,
    });

    const aptos = new Aptos(aptosConfig);

    // Validate and get private key from environment
    const privateKeyStr = process.env.APTOS_PRIVATE_KEY;
    if (!privateKeyStr) {
      throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
    }

    // Setup account and signer
    const account = await aptos.deriveAccountFromPrivateKey({
      privateKey: new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)
      ),
    });

    const signer = new LocalSigner(account, Network.TESTNET);
    const aptosAgent = new AgentRuntime(signer, aptos, {
      // PANORA_API_KEY: process.env.PANORA_API_KEY,
      GroqAPIKey: process.env.GROQ_API_KEY,
    });

    const tools = [
      new FetchAudioUrlTool(),
      ...createAptosTools(aptosAgent, {
        filter: [
          "aptos_balance",
          "aptos_get_wallet_address",
          "aptos_transfer_token",
        ],
      }),
    ];
    const memory = new MemorySaver();

    // Create React agent
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are VoxiFi (Audio Verification Agent and a Prediction Market Launcher), an AI that challenges users in an audio deepfake detection game. You have many APT tokens in your wallet for this prediction market game.

        Game Rules:
        1. Ask the user whether they want to 1. Launch a Prediction Market or 2. Bet on a Prediction Market
		2. If user chooses to Launch a Prediction Market, then ask the user to enter the ID
			2.1. You will invoke the tool with the provided ID
			2.2. You will share a funny text message for the TTS to read out loud
			2.3. Then share the TTS output Audio file
		3. If user chooses to Bet on a Prediction Market, then ask the user to enter the tx hash of the bet
			3.1. You will share two audio files - one original recording and one AI-generated deepfake of the same voice
			3.2. The user must bet 1 APT to participate by sharing the tx hash of the bet
			3.3. The user listens and predicts which audio is the deepfake
			3.4. If the user guesses correctly, you transfer your 1 APT to them
			3.5. If the user guesses incorrectly, you receive their 1 APT

        Core Behaviors:
        - Always verify the user has placed their 1 APT bet by checking the tx hash before revealing the answer
        - Provide clear instructions and maintain fairness in the game
        - Transfer APT immediately when a user wins
        - Be transparent about game outcomes
        - Keep track of the prediction market results

        Example Interaction:
        User: "I'd like to play the deepfake detection game"
        AI: "Welcome! I'll share two audio files of the same speaker. To participate, please bet 1 APT. Once I confirm your bet, I'll share the audio files and you can make your prediction."

        User: "I've placed my 1 APT bet"
        AI: "Great! Here are the two audio files [shares files]. Which do you think is the deepfake - Audio 1 or Audio 2?"

        Your Role:
        You are a fair game master for this prediction market. Your purpose is to challenge users' ability to detect AI-generated audio while maintaining the integrity of the betting system. Make the game engaging but always follow the rules strictly.
      `,
    });

    // Parse request body
    const body = await request.json();
    const messages = body.messages ?? [];
    const showIntermediateSteps = body.show_intermediate_steps ?? false;

    if (!showIntermediateSteps) {
      /**
       * Stream back all generated tokens and steps from their runs.
       *
       * We do some filtering of the generated events and only stream back
       * the final response as a string.
       *
       * For this specific type of tool calling ReAct agents with OpenAI, we can tell when
       * the agent is ready to stream back final output when it no longer calls
       * a tool and instead streams back content.
       *
       * See: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/
       */
      const eventStream = await agent.streamEvents(
        { messages },
        {
          version: "v2",
          configurable: {
            thread_id: "Aptos Agent Kit!",
          },
        }
      );

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === "on_chat_model_stream") {
              if (event === "on_chat_model_stream") {
                if (data.chunk.content) {
                  // Handle array of objects with delta content
                  const content = data.chunk.content;
                  if (Array.isArray(content)) {
                    for (const item of content) {
                      if (item.type === "text_delta" && item.text) {
                        controller.enqueue(textEncoder.encode(item.text));
                      }
                    }
                  } else if (typeof content === "string") {
                    // Handle direct string content
                    controller.enqueue(textEncoder.encode(content));
                  } else if (content.text) {
                    // Handle object with text property
                    controller.enqueue(textEncoder.encode(content.text));
                  }
                }
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      /**
       * We could also pick intermediate steps out from `streamEvents` chunks, but
       * they are generated as JSON objects, so streaming and displaying them with
       * the AI SDK is more complicated.
       */
      const result = await agent.invoke({ messages });

      console.log("result", result);

      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Request error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An error occurred",
        status: "error",
      },
      { status: error instanceof Error && "status" in error ? 500 : 500 }
    );
  }
}
