import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { normalizeJwksEnv, normalizeJwtPrivateKeyEnv } from "./jwtEnv";

normalizeJwtPrivateKeyEnv();
normalizeJwksEnv();

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      // Same normalization for sign-in and sign-up so providerAccountId always matches.
      profile: (params) => {
        const raw = params.email;
        const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("Please enter a valid email address.");
        }
        return { email };
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
  ],
});
