import { createAuthClient } from 'better-auth/client';
import { NextRequest, NextResponse } from 'next/server';

// Define the user type with role
type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Create the client lazily to allow mocking in tests
let client: ReturnType<typeof createAuthClient>;

export async function middleware(request: NextRequest) {
  // Initialize client if not already initialized
  if (!client) {
    client = createAuthClient();
  }

  const { data: session } = await client.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  });

  // If no session, redirect to home
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Type assertion for the user object
  const user = session.user as User;

  // Check if the user has admin role
  const isAdmin = user.role === 'admin';

  // If trying to access admin routes without admin role, redirect to home
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Add a function to reset the client (for testing)
export function resetAuthClient() {
  client = undefined as any;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/booking',
    '/booking/:path*',
    '/bookings',
    '/bookings/:path*',
  ],
};
