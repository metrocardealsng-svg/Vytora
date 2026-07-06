"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  user_id: string;
  username: string;
  body: string;
  created_at: string;
};

type Post = {
  id: string;
  user_id: string;
  username: string;
  content: string;
  media_urls: string[] | null;
  likes_count: number;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
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
  const lastIdRef = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("tribe_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50);
    if (data && data.length > 0) {
      const lastNew = data[data.length - 1].id;
      if (lastNew !== lastIdRef.current) {
        lastIdRef.current = lastNew;
        setMessages(data as Message[]);
      }
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    // Poll every 2 seconds as reliable fallback
    const interval = setInterval(fetchMessages, 2000);

    // Also try realtime
    const channel = supabase
      .channel("tribe-chat-v2")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tribe_messages" },
        () => { fetchMessages(); }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    const { error } = await supabase.from("tribe_messages").insert({
      user_id: userId,
      username,
      body: trimmed,
    });
    if (error) {
      console.error("Send error:", error);
      setText(trimmed); // restore text if failed
    }
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
          <p className="text-center text-slate-500 text-sm mt-8">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.user_id === userId;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && (
                <span className="text-xs text-slate-500 mb-1 ml-1">{m.username || "User"}</span>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                isMe
                  ? "bg-mint text-ink font-medium rounded-br-sm"
                  : "bg-white/8 text-white rounded-bl-sm"
              }`}>
                {m.body}
              </div>
              <span className="text-[10px] text-slate-600 mt-1 mx-1">
                {timeAgo(m.created_at)}
              </span>
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
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="rounded-xl bg-mint px-4 py-2.5 text-sm font-black text-ink disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// ---- JOURNEY FEED ----
function JourneyFeed({ userId, username }: { userId: string; username: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newPost, setNewPost] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from("tribe_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setPosts(data as Post[]);
  }, []);

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 5000);
    return () => clearInterval(interval);
  }, [loadPosts]);

  async function submitPost() {
    if (!newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("tribe_posts").insert({
      user_id: userId,
      username,
      content: newPost.trim(),
    });
    if (!error) setNewPost("");
    else console.error("Post error:", error);
    setPosting(false);
    loadPosts();
  }

  async function loadComments(postId: string) {
    const { data } = await supabase
      .from("tribe_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments((prev) => ({ ...prev, [postId]: data as Comment[] }));
  }

  function toggleComments(postId: string) {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) { next.delete(postId); }
      else { next.add(postId); loadComments(postId); }
      return next;
    });
  }

  async function submitComment(postId: string) {
    const text = commentText[postId]?.trim();
    if (!text) return;
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    await supabase.from("tribe_comments").insert({
      post_id: postId,
      user_id: userId,
      username,
      content: text,
    });
    loadComments(postId);
  }

  async function likePost(postId: string) {
    await supabase.from("tribe_likes").insert({ post_id: postId, user_id: userId });
    await supabase.rpc("increment_likes", { post_id: postId });
    loadPosts();
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-5">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your journey... a run, a win, anything."
          rows={3}
          className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-mint resize-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={submitPost}
            disabled={!newPost.trim() || posting}
            className="rounded-xl bg-gradient-to-r from-mint to-teal px-5 py-2.5 text-sm font-black text-ink disabled:opacity-40 hover:opacity-90 transition-opacity"
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

      {posts.map((post) => {
        const showComments = expandedComments.has(post.id);
        return (
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

            <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>

            <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
              <button
                onClick={() => likePost(post.id)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-mint transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {post.likes_count > 0 && post.likes_count}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-mint transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Comment
              </button>
            </div>

            {showComments && (
              <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                {(comments[post.id] || []).map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {(c.username || "U")[0].toUpperCase()}
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-2 flex-1">
                      <p className="text-xs font-bold text-slate-300">{c.username}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-mint"
                  />
                  <button
                    onClick={() => submitComment(post.id)}
                    className="rounded-xl bg-mint px-3 py-2 text-xs font-black text-ink hover:opacity-90"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- MAIN ----
export default function TribeClient({ userId, username }: { userId: string; username: string }) {
  const [tab, setTab] = useState<"feed" | "chat">("feed");

  return (
    <div>
      <div className="flex gap-2 mb-6 lg:hidden">
        {(["feed", "chat"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold capitalize transition-colors ${
              tab === t ? "bg-mint text-ink" : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
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
