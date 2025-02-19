import { Tool } from "langchain/tools";

class FetchAudioUrlTool extends Tool {
  name = "fetch_audio_url_from_id";
  description = "Fetch the audio url from the given ID";

  constructor() {
    super();
  }

  async _call(args: string): Promise<string> {
    // Your tool implementation
    return `https://firebasestorage.googleapis.com/v0/b/voxifi.firebasestorage.app/o/user-recordings%2F${args}.mp3?alt=media`;
  }
}

export { FetchAudioUrlTool };
