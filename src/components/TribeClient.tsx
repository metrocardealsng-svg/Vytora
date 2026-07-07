"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Message = { id: string; user_id: string; username: string; body: string; created_at: string; };
type Post = { id: string; user_id: string; username: string; content: string; media_urls: string[] | null; likes_count: number; created_at: string; };

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ---- LIVE CHAT ----
function LiveChat({ userId, username }: { userId: string; username: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/tribe/messages");
    const data = await res.json();
    if (data.messages) setMessages(data.messages);
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    await fetch("/api/tribe/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: trimmed, userId, username }),
    });
    setSending(false);
    fetchMessages();
  }

  return (
    <div className="glass rounded-3xl flex flex-col h-[520px]">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <h2 className="font-bold text-white">Live Chat</h2>
        <span className="ml-auto text-xs text-slate-500">{messages.length} messages</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 text-sm mt-8">No messages yet. Say hi!</p>
        )}
        {messages.map((m) => {
          const isMe = m.user_id === userId;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && <span className="text-xs text-slate-500 mb-1 ml-1">{m.username || "User"}</span>}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-mint text-ink font-medium rounded-br-sm" : "bg-white/8 text-white rounded-bl-sm"}`}>
                {m.body}
              </div>
              <span className="text-[10px] text-slate-600 mt-1 mx-1">{timeAgo(m.created_at)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-white/5 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-mint"
        />
        <button onClick={send} disabled={!text.trim() || sending}
          className="rounded-xl bg-mint px-4 py-2.5 text-sm font-black text-ink disabled:opacity-40">
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// ---- JOURNEY FEED ----
function JourneyFeed({ userId, username }: { userId: string; username: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/tribe/posts");
    const data = await res.json();
    if (data.posts) setPosts(data.posts);
  }, []);

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 5000);
    return () => clearInterval(interval);
  }, [loadPosts]);

  async function uploadImage(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/tribe/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) setMediaUrls((prev) => [...prev, data.url]);
    setUploading(false);
  }

  async function submitPost() {
    if (!content.trim() && mediaUrls.length === 0) return;
    setPosting(true);
    const res = await fetch("/api/tribe/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, media_urls: mediaUrls, userId, username }),
    });
    const data = await res.json();
    if (data.post) {
      setContent("");
      setMediaUrls([]);
      loadPosts();
    }
    setPosting(false);
  }

  async function likePost(postId: string) {
    await fetch("/api/tribe/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    loadPosts();
  }

  return (
    <div className="space-y-5">
      {/* Post composer */}
      <div className="glass rounded-3xl p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your journey... a run, a win, anything."
          rows={3}
          className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-mint resize-none"
        />

        {/* Image previews */}
        {mediaUrls.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {mediaUrls.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} className="h-20 w-20 rounded-xl object-cover" alt="" />
                <button
                  onClick={() => setMediaUrls((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >×</button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {uploading ? "Uploading..." : "Add photo"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />

          <button
            onClick={submitPost}
            disabled={(!content.trim() && mediaUrls.length === 0) || posting}
            className="rounded-xl bg-gradient-to-r from-mint to-teal px-5 py-2.5 text-sm font-black text-ink disabled:opacity-40"
          >
            {posting ? "Posting..." : "Post to Tribe"}
          </button>
        </div>
      </div>

      {posts.length === 0 && (
        <div className="glass rounded-3xl py-16 text-center text-slate-500">
          No posts yet. Be the first to share your journey.
        </div>
      )}

      {posts.map((post) => (
        <div key={post.id} className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-mint to-teal flex items-center justify-center text-sm font-black text-ink">
              {(post.username || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{post.username || "User"}</p>
              <p className="text-xs text-slate-500">{timeAgo(post.created_at)}</p>
            </div>
          </div>

          {post.content && <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>}

          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.media_urls.map((url, i) => (
                <img key={i} src={url} className="w-full rounded-xl object-cover max-h-48" alt="" />
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
            <button onClick={() => likePost(post.id)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-mint transition-colors">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {post.likes_count > 0 && post.likes_count}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TribeClient({ userId, username }: { userId: string; username: string }) {
  const [tab, setTab] = useState<"feed" | "chat">("feed");
  return (
    <div>
      <div className="flex gap-2 mb-6 lg:hidden">
        {(["feed", "chat"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold capitalize transition-colors ${tab === t ? "bg-mint text-ink" : "bg-white/5 text-slate-400"}`}>
            {t === "feed" ? "Journey Feed" : "Live Chat"}
          </button>
        ))}
      </div>
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        <div className={`lg:col-span-3 ${tab !== "feed" ? "hidden lg:block" : ""}`}>
          <JourneyFeed userId={userId} username={username} />
        </div>
        <div className={`lg:col-span-2 ${tab !== "chat" ? "hidden lg:block" : ""}`}>
          <LiveChat userId={userId} username={username} />
        </div>
      </div>
    </div>
  );
}
