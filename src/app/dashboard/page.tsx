"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      window.location.href = "/"
      return
    }

    setUser(data.user)
    fetchBookmarks(data.user.id)
  }

  // FETCH BOOKMARKS
  async function fetchBookmarks(userId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error) setBookmarks(data || [])
  }

  // ADD BOOKMARK
  async function addBookmark() {
    if (!title || !url) return

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id
    })

    setTitle("")
    setUrl("")
    fetchBookmarks(user.id)
  }

  // DELETE BOOKMARK
  async function deleteBookmark(id: string) {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(user.id)
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>

      {/* ADD BOOKMARK */}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1"
        />

        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1"
        />

        <button
          onClick={addBookmark}
          className="bg-black text-white px-4"
        >
          Add
        </button>
      </div>

      {/* BOOKMARK LIST */}
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center border p-3 mb-2"
        >
          <a href={b.url} target="_blank" className="underline">
            {b.title}
          </a>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
