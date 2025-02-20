# Deepfake Prediction Market Wallet Agent with Next.js and Aptos Agent Kit

![image](https://github.com/user-attachments/assets/34952824-f21f-4ac1-9a24-13cca2471277)

This project invites the user to create a prediction market to verify deepfake/real voices.

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
