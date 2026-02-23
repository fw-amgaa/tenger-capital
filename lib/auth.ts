import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

const trustedOrigins: string[] = [];
if (process.env.BETTER_AUTH_URL)
  trustedOrigins.push(process.env.BETTER_AUTH_URL);
if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
  trustedOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
if (process.env.VERCEL_URL)
  trustedOrigins.push(`https://${process.env.VERCEL_URL}`);
if (process.env.VERCEL_BRANCH_URL)
  trustedOrigins.push(`https://${process.env.VERCEL_BRANCH_URL}`);

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  trustedOrigins,
  secret:
    process.env.BETTER_AUTH_SECRET || "development-secret-change-in-production",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});
