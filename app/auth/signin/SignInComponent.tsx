"use client"

import React from "react";
import { getProviders } from "next-auth/react";
import { signIn } from "next-auth/react";

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

export default function SignInComponent({ providers }: Props) {
  return (
    <div className="flex justify-center">
      {Object.values(providers!).map((provider) => (
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signIn(provider.id, {
            callbackUrl: process.env.VERCEL_URL || "http://localhost:3000"
          })}>
            Entre com {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}