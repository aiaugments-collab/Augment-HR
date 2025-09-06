import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

// Get the base URL dynamically - use current origin on client, fallback for server
const baseURL = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient(), organizationClient()],
});

export const { signIn, signOut, useSession } = authClient;
