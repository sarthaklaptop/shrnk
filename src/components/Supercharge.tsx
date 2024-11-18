"use client"

import { signIn } from "next-auth/react"
import { RainbowButton } from "./ui/rainbow-button"

export default function SuperCharge() {
    return (
        <div className="flex h-lvh flex-col w-full items-center justify-center mx-auto gap-2">
            <div className="flex flex-col items-center justify-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-[#F39C19] via-[#F2C511] to-pink-500 bg-clip-text text-transparent">Revolutionize</p>
                <p className="text-3xl font-bold">your link management</p>
            </div>
            <div className="text-gray-500 flex flex-col items-center justify-center">
                <p>Unlock the power of fast, reliable link management with Shrnk.</p>
                <p> Built for modern needs, tailored for seamless sharing.</p>
            </div>
            <RainbowButton onClick={() => signIn("google", { callbackUrl: '/x' })}>
                Start for Free
            </RainbowButton>
        </div>
    )
}