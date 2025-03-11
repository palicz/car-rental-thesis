import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (globalThis.window !== undefined) {
    // Browser should use relative path
    return '';
  }

  // Reference environment variables
  if (process.env.VERCEL_URL) {
    // Vercel deployment
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.BETTER_AUTH_URL) {
    // Use the configured auth URL if available
    return process.env.BETTER_AUTH_URL;
  }

  // Default to localhost for development
  return 'http://localhost:3000';
};

export const authClient = createAuthClient({
  plugins: [adminClient()],
  baseURL: getBaseUrl(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
