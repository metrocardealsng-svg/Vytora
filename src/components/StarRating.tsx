"use client";

import { useEffect, useState } from "react";

type Props = {
  userId?: string;
};

export default function StarRating({ userId }: Props) {
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/ratings")
      .then((r) => r.json())
      .then((d) => {
        setAverage(d.average || 0);
        setTotal(d.total || 0);
        setLoading(false);
      });
  }, []);

  async function submitRating(rating: number) {
    if (!userId || submitted) return;
    setAnimating(rating);
    setSelected(rating);
    setTimeout(() => setAnimating(null), 600);
    setSubmitted(true);

    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, rating }),
    });
    const data = await res.json();
    if (data.average) {
      setAverage(data.average);
      setTotal(data.total);
    }
  }

  const displayRating = hovered || selected || average;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayRating;
          const isAnimating = animating !== null && star <= animating;
          return (
            <button
              key={star}
              onClick={() => submitRating(star)}
              onMouseEnter={() => !submitted && userId && setHovered(star)}
              onMouseLeave={() => !submitted && setHovered(0)}
              disabled={submitted || !userId}
              className="relative disabled:cursor-default"
              style={{
                transform: isAnimating ? "scale(1.4)" : hovered >= star ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                style={{
                  fill: filled ? "#34e0a1" : "#1e293b",
                  filter: filled ? "drop-shadow(0 0 6px rgba(52,224,161,0.6))" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {isAnimating && (
                <span
                  className="absolute inset-0 rounded-full bg-mint/30"
                  style={{ animation: "ping 0.5s ease-out forwards" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {!loading && (
        <div className="flex items-center gap-1.5 text-sm">
          {average > 0 ? (
            <>
              <span className="font-black text-white">{average}</span>
              <span className="text-mint">★</span>
              <span className="text-slate-500">
                ({total.toLocaleString()} {total === 1 ? "rating" : "ratings"})
              </span>
            </>
          ) : (
            <span className="text-slate-500 text-xs">Be the first to rate Vytora</span>
          )}
        </div>
      )}

      {submitted && (
        <p className="text-xs text-mint" style={{ animation: "fadeIn 0.3s ease" }}>
          Thanks for rating! 🙏
        </p>
      )}
      {!userId && (
        <p className="text-xs text-slate-600">
          <a href="/signup" className="text-mint hover:underline">Sign up</a> to rate
        </p>
      )}

      <style>{`
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
