import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { expo } from "@better-auth/expo";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleProvider =
  !!GOOGLE_CLIENT_ID &&
  !!GOOGLE_CLIENT_SECRET &&
  GOOGLE_CLIENT_ID !== "your_google_client_id";

// Build social providers conditionally (only if credentials exist)
const socialProviders: Record<string, any> = {};
if (hasGoogleProvider) {
  socialProviders.google = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.NODE_ENV !== "production") {
  console.log("[auth] google provider enabled:", hasGoogleProvider);
  console.log("[auth] baseURL:", process.env.BETTER_AUTH_URL);
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [expo()],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "farmbridge://",
    ...(process.env.NODE_ENV !== "production"
      ? ["exp://10.11.235.236:8081"]
      : []),
  ],
  debug: process.env.NODE_ENV !== "production",
  allowDangerousEmailAccountLinking: process.env.NODE_ENV !== "production",
});
