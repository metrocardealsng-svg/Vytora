"use client";

import { useEffect, useRef } from "react";

export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;

    async function acquire() {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      } catch (err) {
        console.log("Wake lock failed:", err);
      }
    }

    async function release() {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    }

    if (active) {
      acquire();
    } else {
      release();
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && active) acquire();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      release();
    };
  }, [active]);
}
