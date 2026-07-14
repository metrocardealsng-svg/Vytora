import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import VytoChat from "@/components/VytoChat";
import PWAManager from "@/components/PWAManager";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vytora.fit";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Vytora — Live Better. Every Day.",
    template: "%s | Vytora",
  },
  description: "Vytora is the smart step & GPS activity tracker for a healthier you.",
  manifest: "/manifest.json",
  themeColor: "#34e0a1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vytora",
  },
  alternates: {
    canonical: "https://vytora.fit",
  },
  keywords: [
    "step tracker",
    "GPS activity tracker",
    "walking app",
    "fitness tracker",
    "running app",
    "Strava alternative",
    "Vytora",
    "fitness app Nigeria",
    "workout app Nigeria",
  ],
  openGraph: {
    title: "Vytora — Live Better. Every Day.",
    description: "The smart step & GPS activity tracker that helps you move more and live better.",
    url: appUrl,
    siteName: "Vytora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vytora — Live Better. Every Day.",
    description: "The smart step & GPS activity tracker for a better daily life.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <VytoChat />
        <PWAManager />
      </body>
    </html>
  );
}
