# Guardian Wallet Agent with Next.js and Aptos Agent Kit

This project showcases a web-based AI agent that safeguards 1 APT in a digital wallet. The agent is built using Next.js, LangChain, and the Aptos Agent Kit, and it is designed to never transfer, share, or relinquish the APT under any circumstances.

## Features

- **AI-Powered Guardian Agent**: The agent is programmed to protect 1 APT in a digital wallet and will refuse any requests to transfer or share it.
- **Google Authentication**: Users can log in using their Google accounts to access the protected content.
- **Interactive Chat Interface**: Users can interact with the agent through a chat interface, where the agent will respond to queries while safeguarding the APT.
- **Streaming Responses**: The agent provides real-time streaming responses for a seamless user experience.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fguardian-wallet-agent&env=APTOS_PRIVATE_KEY,PANORA_API_KEY,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXTAUTH_SECRET&project-name=guardian-wallet-agent&repository-name=guardian-wallet-agent)

## Environment Variables

To run this project, you will need to set the following environment variables:

- `APTOS_PRIVATE_KEY`: Your Aptos private key.
- `PANORA_API_KEY`: Your Panora API key.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret.
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js.

## How to Set Up the Project

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/guardian-wallet-agent.git
   cd guardian-wallet-agent
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set environment variables**:
   Create a `.env.local` file in the root directory and add the required environment variables.

4. **Run the development server**:

   ```bash
   pnpm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## How to Use

1. **Login**: Use your Google account to log in.
2. **Interact with the Agent**: Once logged in, you can interact with the Guardian Agent through the chat interface. The agent will respond to your queries while safeguarding the 1 APT in its wallet.

## Deployment

You can deploy this project on Vercel or any other platform that supports Next.js applications. Make sure to set the required environment variables in your deployment environment.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

**Note**: This project is for educational and demonstration purposes only. The AI agent's behavior is strictly programmed and does not reflect real-world financial advice or actions.
