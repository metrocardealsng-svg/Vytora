import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let _db: NodePgDatabase | null = null;
let _pool: Pool | null = null;

function init() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  _pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  _db = drizzle(_pool);
  return _db;
}

export const db = new Proxy({} as NodePgDatabase, {
  get(_target, prop) {
    return (init() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
