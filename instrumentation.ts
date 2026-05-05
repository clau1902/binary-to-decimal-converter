export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = (await import("postgres")).default;

    const url = process.env.POSTGRES_URL;
    if (!url) {
      console.warn("POSTGRES_URL not set, skipping migrations");
      return;
    }

    const client = postgres(url, { max: 1 });
    const db = drizzle(client);

    await migrate(db, { migrationsFolder: "./drizzle" });
    await client.end();
  }
}
