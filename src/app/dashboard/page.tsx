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
    return () => supabase.removeAllChannels()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      window.location.href = "/"
      return
    }

    setUser(data.user)
    fetchBookmarks(data.user.id)
    subscribeToBookmarks(data.user.id)
  }

  async function fetchBookmarks(userId: string) {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  function subscribeToBookmarks(userId: string) {
    supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks(userId)
      )
      .subscribe()
  }

  async function addBookmark() {
    if (!title || !url) return

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    })

    setTitle("")
    setUrl("")
  }

  async function deleteBookmark(id: string) {
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-semibold">Bookmark Manager</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{user?.email}</span>

          <button
            onClick={logout}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8">

        {/* ADD BOOKMARK */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-medium mb-4">Add Bookmark</h2>

          <div className="flex gap-3">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-md p-3 flex-1"
            />

            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border rounded-md p-3 flex-1"
            />

            <button
              onClick={addBookmark}
              className="bg-black text-white px-6 rounded-md hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* BOOKMARK LIST */}
        <div className="space-y-4">
          {bookmarks.length === 0 && (
            <div className="text-center text-gray-500">
              No bookmarks yet 🚀
            </div>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{b.title}</p>
                <a
                  href={b.url}
                  target="_blank"
                  className="text-blue-500 text-sm hover:underline"
                >
                  {b.url}
                </a>
              </div>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
