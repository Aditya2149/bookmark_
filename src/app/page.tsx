"use client"

import { supabase } from "../lib/supabase"

export default function Home() {

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`
      }
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
