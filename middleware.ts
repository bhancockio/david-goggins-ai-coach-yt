import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/api/assistant/create",
    "/api/thread",
    "/api/message/create",
    "/api/message/list",
    "/api/run/create",
    "/api/run/retrieve",
    "/api/challenge-users",
    "/api/openai",
    "/api/send-notifications",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
