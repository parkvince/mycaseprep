// Node-only admin session check for API routes. Kept separate from lib/admin.ts
// (which proxy.ts imports into the Edge middleware bundle) since this pulls in
// next-auth's server session + Prisma, neither of which belong in an Edge bundle.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) return null;
  return session;
}
