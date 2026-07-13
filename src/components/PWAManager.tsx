"use client";

import { useEffect, useState } from "react";

export default function PWAManager() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Android Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari hint
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowBanner(true), 4000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (installPrompt) {
      (installPrompt as any).prompt();
      const { outcome } = await (installPrompt as any).userChoice;
      if (outcome === "accepted") setIsInstalled(true);
    }
    setShowBanner(false);
  }

  const isIOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl bg-[#0e1118] p-4 shadow-2xl ring-1 ring-white/10">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-teal text-ink font-black text-lg">V</div>
        <div className="flex-1">
          <p className="font-black text-white text-sm">Install Vytora</p>
          {isIOS ? (
            <p className="text-xs text-slate-400 mt-0.5">Tap the share icon → "Add to Home Screen"</p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">Install for the full app experience. Works offline too.</p>
          )}
        </div>
        <button onClick={() => setShowBanner(false)} className="text-slate-500 hover:text-white text-lg">×</button>
      </div>
      {!isIOS && (
        <button onClick={install}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-mint to-teal py-2.5 text-sm font-black text-ink">
          Install App
        </button>
      )}
    </div>
  );
}
