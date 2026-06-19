import { getAuth } from "~/server/lib/auth";

const skipPaths = [
  "/api/auth",
  "/api/applications/apply",
  "/api/automation/callback",
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url.pathname.startsWith("/api")) return;
  if (skipPaths.some(p => url.pathname.startsWith(p))) return;
  if (url.pathname.includes("/public")) return;

  const auth = getAuth();

  try {
    const session = await auth.api.getSession({ headers: event.headers });
    if (session) {
      event.context.session = session;
      event.context.user = session.user;
    }
  } catch {
  }
});
