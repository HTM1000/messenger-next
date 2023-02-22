import { getServerSession } from "next-auth";
import React from "react";
import '../styles/globals.css';
import { Message } from "../typing";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import Providers from "./providers";

export default async function Homepage() {
  const data = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/getMessages`).then((res) => res.json())
  const session = await getServerSession();

  const messages: Message[] = data.messages
    
  return (
    <Providers session={session}>
      <main>
        <MessageList initialMessage={messages} />
        <ChatInput session={session} />
      </main>
    </Providers>
  )
}