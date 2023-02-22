"use client"

import React, { useEffect } from "react"
import useSWR from "swr"
import { clientPusher } from "../pusher"
import { Message } from "../typing"
import fetcher from "../utils/fetchMessages"
import MessageComponent from "./MessageComponent"

type Props = {
  initialMessage: Message[]
}

export default function MessageList({ initialMessage }: Props) {
  const { data: messages, error, mutate } = useSWR<Message[]>("/api/getMessages", fetcher)

  useEffect(() => {
    const channel = clientPusher.subscribe("messages")

    channel.bind("new-message", async (data: Message) => {
      if (messages?.find((message) => message.id === data.id)) return

      if (!messages) {
        mutate(fetcher)
      } else {
        mutate(fetcher, {
          optimisticData: [...messages!, data],
          rollbackOnError: true,
        })
      }
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages, mutate, clientPusher])

  return (
    <div className="space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto">
      {(messages || initialMessage).map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  )
}