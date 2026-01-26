import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // During build time, we don't need a real connection
    if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    // Return a dummy URL for build time
    return "postgresql://localhost:5432/dummy";
  }
  return url;
}

function getDb() {
  if (!dbInstance) {
    const connectionString = getDatabaseUrl();
    // Only create connection if we have a real URL (not during build)
    if (connectionString !== "postgresql://localhost:5432/dummy" || process.env.DATABASE_URL) {
      const client = postgres(connectionString, {
        max: 1,
      });
      dbInstance = drizzle(client, { schema });
    }
  }
  return dbInstance;
}

// Lazy initialization - only connect when actually used
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const db = getDb();
    if (!db) {
      throw new Error("Database not initialized. DATABASE_URL must be set.");
    }
    return db[prop as keyof typeof db];
  },
});

