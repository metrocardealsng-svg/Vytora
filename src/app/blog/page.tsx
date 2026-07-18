import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Blog — Nigerian Workout Tips & Food Guides",
  description: "Running routes in Lagos and Abuja, Nigerian food calorie guides, HIIT tips, and fitness advice built for Nigerians.",
};

const posts = [
  {
    slug: "best-running-routes-lagos",
    title: "Best Running Routes in Lagos (2026 Guide)",
    excerpt: "From Lekki Conservation Centre to Victoria Island waterfront — the safest, most scenic routes for runners in Lagos.",
    tag: "Lagos",
    emoji: "🏃",
    readTime: "5 min read",
  },
  {
    slug: "best-running-routes-abuja",
    title: "Best Running Routes in Abuja for Every Level",
    excerpt: "Millennium Park, Jabi Lake, and Maitama trails — Abuja has some of Nigeria's best running infrastructure. Here's how to use it.",
    tag: "Abuja",
    emoji: "🌳",
    readTime: "4 min read",
  },
  {
    slug: "nigerian-food-calorie-guide",
    title: "Nigerian Food Calorie Guide: Eba, Jollof, Pounded Yam & More",
    excerpt: "The complete calorie and macro breakdown of Nigerian foods. Finally, a guide that doesn't just talk about chicken breast.",
    tag: "Nutrition",
    emoji: "🍲",
    readTime: "8 min read",
  },
  {
    slug: "track-steps-without-draining-data",
    title: "How to Track Steps Without Draining Mobile Data in Nigeria",
    excerpt: "GPS tracking doesn't have to destroy your data bundle. Here's how Vytora keeps tracking light on data.",
    tag: "Tips",
    emoji: "📱",
    readTime: "3 min read",
  },
  {
    slug: "hiit-workout-nigeria",
    title: "HIIT Workouts Built for Nigerian Heat and No-Gym Life",
    excerpt: "High intensity training adapted for Lagos weather, no equipment, and real Nigerian schedules.",
    tag: "HIIT",
    emoji: "🔥",
    readTime: "6 min read",
  },
  {
    slug: "military-calisthenics-nigeria",
    title: "Military Calisthenics: Build Serious Strength With No Equipment",
    excerpt: "Push-ups, pull-ups, dips and burpees done the military way. How to train like a soldier with just your bodyweight.",
    tag: "Calisthenics",
    emoji: "💪",
    readTime: "7 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white">Fitness Blog</h1>
            <p className="mt-2 text-slate-400">Nigerian fitness tips, routes, food guides and workout plans.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="glass rounded-2xl p-6 hover:ring-1 hover:ring-mint/30 transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{post.emoji}</span>
                  <span className="text-xs font-black text-mint uppercase tracking-wider">{post.tag}</span>
                  <span className="ml-auto text-xs text-slate-500">{post.readTime}</span>
                </div>
                <h2 className="font-black text-white text-lg leading-snug group-hover:text-mint transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{post.excerpt}</p>
                <p className="mt-4 text-xs font-bold text-mint">Read more →</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
