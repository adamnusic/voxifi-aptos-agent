// middleware.ts (in root directory)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		// Add custom middleware logic here if needed
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		pages: {
			signIn: "/login",
		},
	},
);

// Protect specific paths
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - /api/auth/* (auth endpoints)
		 * - /login (login page)
		 * - /_next/* (next.js internals)
		 * - /fonts/* (inside public directory)
		 * - /favicon.ico, /images/* (other public files)
		 */
		"/((?!api/auth|login|_next|fonts|favicon.ico|images).*)",
	],
};
