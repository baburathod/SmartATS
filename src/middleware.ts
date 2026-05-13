import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/recruiter") && token?.role !== "recruiter") {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }

    if (path.startsWith("/candidate") && token?.role !== "candidate") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/recruiter/:path*", "/candidate/:path*"],
};
