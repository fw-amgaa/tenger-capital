import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { user, account } from "../lib/db/schema";
import { randomUUID } from "crypto";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  const userId = randomUUID();

  // Hash password using better-auth's internal method
  const { hashPassword } = await import("better-auth/crypto");
  const hashedPassword = await hashPassword("admin123");

  // Create admin user
  await db.insert(user).values({
    id: userId,
    name: "Admin",
    email: "admin@tengercapital.mn",
    emailVerified: true,
  }).onConflictDoNothing();

  // Create account with password
  await db.insert(account).values({
    id: randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: hashedPassword,
  }).onConflictDoNothing();

  console.log("Admin user created:");
  console.log("  Email: admin@tengercapital.mn");
  console.log("  Password: admin123");
  console.log("Seeding complete!");
}

seed()
  .catch(console.error)
  .finally(async () => {
    await pool.end();
    process.exit();
  });
