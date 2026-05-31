// middleware.ts
import nextAuthMiddleware from "next-auth/middleware";

export const middleware = nextAuthMiddleware;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};