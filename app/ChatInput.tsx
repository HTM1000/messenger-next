"use client"

import React, { FormEvent, useState } from "react"
import { v4 as uuid } from "uuid"
import { Message } from "../typing"
import useSWR from "swr"
import fetcher from "../utils/fetchMessages"
import { getServerSession } from "next-auth"

type Props = {
  session: Awaited<ReturnType<typeof getServerSession>>
}

export default function ChatInput({ session }: Props) {
  const [input, setInput] = useState("")
  const { data: messages, mutate } = useSWR("/api/getMessages", fetcher)

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input || !session) return;

    const messageToSend = input

    setInput("")

    const id = uuid()

    const message: Message = {
      id,
      message: messageToSend,
      created_at: Date.now(),
      username: session?.user?.name!,
      profilePic: session?.user?.image!,
      email:  session?.user?.email!
    }

    const uploadMessageToUpstach = async () => {
      const data = await fetch(`/api/addMessage`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          message
        })
      }).then(res => res.json())

      return [...messages!, data.message]
    }

    await mutate(uploadMessageToUpstach, {
      optimisticData: [...messages!, message],
      rollbackOnError: true,
    })
  }

  return (
    <form onSubmit={addMessage} className="fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2 border-t bg-white border-gray-100">
      <input 
        type="text" 
        value={input}
        disabled={!session}
        onChange={e => setInput(e.target.value)}
        placeholder="Escreva sua mensagem aqui"
        className="flex-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!input}
      >
        Enviar
      </button>
    </form>
  )
}