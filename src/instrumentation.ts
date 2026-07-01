import { Pool } from "pg";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.warn("DATABASE_URL not set, skipping auto-migration");
      return;
    }
    const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL DEFAULT '',
          plan TEXT NOT NULL DEFAULT 'free',
          stripe_customer_id TEXT,
          stripe_subscription_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL DEFAULT 'walk',
          title TEXT NOT NULL DEFAULT 'Untitled Activity',
          distance_meters DOUBLE PRECISION NOT NULL DEFAULT 0,
          duration_seconds INTEGER NOT NULL DEFAULT 0,
          steps INTEGER NOT NULL DEFAULT 0,
          calories INTEGER NOT NULL DEFAULT 0,
          avg_pace_sec_per_mile INTEGER NOT NULL DEFAULT 0,
          route JSONB NOT NULL DEFAULT '[]',
          started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
      `);
      console.log("Vytora: database tables ready");
    } catch (err) {
      console.error("Vytora: migration error", err);
    } finally {
      await pool.end();
    }
  }
}
