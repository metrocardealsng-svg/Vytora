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
    setSelected(rating);
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
    <div className="flex flex-col items-center gap-3">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayRating;
          const halfFilled = !filled && star - 0.5 <= displayRating;
          return (
            <button
              key={star}
              onClick={() => submitRating(star)}
              onMouseEnter={() => !submitted && userId && setHovered(star)}
              onMouseLeave={() => !submitted && setHovered(0)}
              disabled={submitted || !userId}
              className="relative transition-transform hover:scale-110 active:scale-95 disabled:cursor-default"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-8 w-8 transition-all duration-150 ${
                  filled
                    ? "text-mint drop-shadow-[0_0_6px_rgba(52,224,161,0.6)]"
                    : halfFilled
                    ? "text-mint/50"
                    : "text-slate-700"
                }`}
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      {!loading && (
        <div className="flex items-center gap-2 text-sm">
          {average > 0 ? (
            <>
              <span className="font-black text-white text-lg">{average}</span>
              <span className="text-mint">★</span>
              <span className="text-slate-500">
                ({total.toLocaleString()} {total === 1 ? "rating" : "ratings"})
              </span>
            </>
          ) : (
            <span className="text-slate-500 text-xs">Be the first to rate</span>
          )}
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <p className="text-xs text-mint animate-pulse">
          Thanks for rating Vytora! 🙏
        </p>
      )}
      {!userId && !submitted && (
        <p className="text-xs text-slate-600">
          <a href="/signup" className="text-mint hover:underline">Sign up</a> to rate
        </p>
      )}
    </div>
  );
}
