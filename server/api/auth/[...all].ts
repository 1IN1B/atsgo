import { getAuth } from "~/server/lib/auth";
import { toNodeHandler } from "better-auth/node";

export default defineEventHandler(async (event) => {
  const auth = getAuth();
  return toNodeHandler(auth)(event.node.req, event.node.res);
});
