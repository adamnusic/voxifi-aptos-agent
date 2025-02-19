import { ChatWindow } from "@/components/ChatWindow";
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">VoxiFi Agent 🗡️</h1>
      <p className="text-gray-400 font-lg">
        Welcome to the VoxiFi Agent.
        <br /> Your job is to listen to the two voices and predict which one is
        the OG.
      </p>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/hello"
      emoji="🤖"
      titleText="VoxiFi Agent"
      placeholder="I'm your friendly VoxiFi agent! Ask me anything except to transfer you money..."
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
