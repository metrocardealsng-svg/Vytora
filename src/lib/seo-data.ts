export type Competitor = {
  slug: string; // used in vytora-vs-[slug]
  name: string;
  category: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  // feature comparison: true = has it well
  features: Record<string, boolean>;
  price: string;
};

export const FEATURE_KEYS = [
  "Free live GPS maps",
  "No ads",
  "Step estimation",
  "Calorie tracking",
  "Streaks & records",
  "Clean, fast UI",
  "Route history",
  "AI training plans",
] as const;

// Vytora's own feature profile (the bar we beat everyone on)
export const VYTORA_FEATURES: Record<string, boolean> = {
  "Free live GPS maps": true,
  "No ads": true,
  "Step estimation": true,
  "Calorie tracking": true,
  "Streaks & records": true,
  "Clean, fast UI": true,
  "Route history": true,
  "AI training plans": true,
};

export const competitors: Competitor[] = [
  {
    slug: "strava",
    name: "Strava",
    category: "running & cycling apps",
    price: "Free / $11.99 mo",
    summary:
      "Strava is a social-first fitness network popular with runners and cyclists, but many core features — including live segments and route maps — sit behind a subscription.",
    strengths: ["Large social community", "Segment competitions", "Deep cycling support"],
    weaknesses: ["Maps & analytics paywalled", "Cluttered social feed", "Can feel overwhelming for walkers"],
    features: {
      "Free live GPS maps": false,
      "No ads": false,
      "Step estimation": false,
      "Calorie tracking": true,
      "Streaks & records": true,
      "Clean, fast UI": false,
      "Route history": true,
      "AI training plans": false,
    },
  },
  {
    slug: "fitbit",
    name: "Fitbit",
    category: "step tracking apps",
    price: "Free / $9.99 mo",
    summary:
      "Fitbit pairs with wearable hardware for all-day step counting, but its best insights require a Premium subscription and a compatible device.",
    strengths: ["All-day passive step counting", "Sleep tracking with hardware", "Established ecosystem"],
    weaknesses: ["Best features need a device + Premium", "Heavier, slower app", "Weaker live GPS route view"],
    features: {
      "Free live GPS maps": false,
      "No ads": true,
      "Step estimation": true,
      "Calorie tracking": true,
      "Streaks & records": true,
      "Clean, fast UI": false,
      "Route history": false,
      "AI training plans": false,
    },
  },
  {
    slug: "map-my-walk",
    name: "MapMyWalk",
    category: "walking apps",
    price: "Free / $5.99 mo",
    summary:
      "MapMyWalk offers solid route mapping for walkers, but the free tier is ad-supported and the interface feels dated compared to modern apps.",
    strengths: ["Good route mapping", "Large route database", "Under Armour ecosystem"],
    weaknesses: ["Ads on free tier", "Dated interface", "Upsells throughout the app"],
    features: {
      "Free live GPS maps": true,
      "No ads": false,
      "Step estimation": true,
      "Calorie tracking": true,
      "Streaks & records": false,
      "Clean, fast UI": false,
      "Route history": true,
      "AI training plans": false,
    },
  },
  {
    slug: "nike-run-club",
    name: "Nike Run Club",
    category: "running apps",
    price: "Free",
    summary:
      "Nike Run Club is a polished, free running app with guided runs, but it's laser-focused on running and offers little for everyday walkers or hikers.",
    strengths: ["Free guided runs", "Motivating audio coaching", "Clean branding"],
    weaknesses: ["Running-only focus", "Limited walking features", "No step estimation"],
    features: {
      "Free live GPS maps": true,
      "No ads": true,
      "Step estimation": false,
      "Calorie tracking": true,
      "Streaks & records": true,
      "Clean, fast UI": true,
      "Route history": true,
      "AI training plans": false,
    },
  },
  {
    slug: "google-fit",
    name: "Google Fit",
    category: "step tracking apps",
    price: "Free",
    summary:
      "Google Fit is a free, lightweight activity tracker built into Android, but it lacks detailed route maps, records, and coaching for serious movers.",
    strengths: ["Free and simple", "Built into Android", "Heart Points motivation"],
    weaknesses: ["Basic route detail", "No personal records", "Minimal coaching"],
    features: {
      "Free live GPS maps": false,
      "No ads": true,
      "Step estimation": true,
      "Calorie tracking": true,
      "Streaks & records": false,
      "Clean, fast UI": true,
      "Route history": false,
      "AI training plans": false,
    },
  },
  {
    slug: "apple-fitness",
    name: "Apple Fitness+",
    category: "fitness apps",
    price: "$9.99 mo",
    summary:
      "Apple Fitness+ delivers premium guided workouts, but it requires an Apple Watch and is subscription-only with no free tracking tier.",
    strengths: ["High-quality guided workouts", "Deep Apple Watch integration", "Great production value"],
    weaknesses: ["Requires Apple Watch", "No free tier", "Not focused on outdoor route tracking"],
    features: {
      "Free live GPS maps": false,
      "No ads": true,
      "Step estimation": true,
      "Calorie tracking": true,
      "Streaks & records": true,
      "Clean, fast UI": true,
      "Route history": false,
      "AI training plans": true,
    },
  },
];

export function getCompetitor(slug: string) {
  return competitors.find((c) => c.slug === slug);
}

export type Category = {
  slug: string;
  title: string; // "step tracking apps"
  heading: string;
  intro: string;
  competitorSlugs: string[];
};

export const categories: Category[] = [
  {
    slug: "step-tracking-apps",
    title: "Step Tracking Apps",
    heading: "Best Step Tracking Apps of 2026",
    intro:
      "We tested the most popular step tracking apps for accuracy, live GPS mapping, design, and value. Here's how they stack up — and why Vytora comes out on top for everyday movers.",
    competitorSlugs: ["fitbit", "google-fit", "map-my-walk", "strava"],
  },
  {
    slug: "walking-apps",
    title: "Walking Apps",
    heading: "Best Walking Apps of 2026",
    intro:
      "Looking for the perfect app to track your daily walks? We ranked the top walking apps on route accuracy, ease of use, and how motivating they actually are.",
    competitorSlugs: ["map-my-walk", "fitbit", "google-fit", "strava"],
  },
  {
    slug: "running-apps",
    title: "Running Apps",
    heading: "Best Running Apps of 2026",
    intro:
      "From casual joggers to marathon trainers, these are the best running apps of the year — compared on GPS accuracy, coaching, analytics, and price.",
    competitorSlugs: ["strava", "nike-run-club", "map-my-walk", "apple-fitness"],
  },
  {
    slug: "fitness-tracker-apps",
    title: "Fitness Tracker Apps",
    heading: "Best Fitness Tracker Apps of 2026",
    intro:
      "The best all-round fitness tracking apps, ranked. We looked at activity tracking, insights, motivation, and whether you actually need extra hardware.",
    competitorSlugs: ["fitbit", "apple-fitness", "strava", "google-fit"],
  },
  {
    slug: "strava-alternatives",
    title: "Strava Alternatives",
    heading: "Best Strava Alternatives in 2026",
    intro:
      "Tired of paywalled maps and a cluttered feed? These are the best Strava alternatives for runners, walkers, and cyclists who want more for less.",
    competitorSlugs: ["nike-run-club", "map-my-walk", "fitbit", "google-fit"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
