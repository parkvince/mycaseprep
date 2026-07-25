// AUDIT-LOG: single writer for the AdminAuditLog trail. Fail-safe by design —
// logging must never break or roll back the admin action it records, so any
// write error is swallowed (and surfaced in server logs) rather than thrown.
import { prisma } from "@/lib/prisma";

export type AdminAction =
  | "user.ban"
  | "user.unban"
  | "user.grant_unlimited"
  | "user.revoke_unlimited"
  | "user.set_bonus"
  | "user.delete"
  | "feedback.resolve"
  | "feedback.reopen"
  | "feedback.delete";

export async function logAdminAction(entry: {
  adminEmail: string;
  action: AdminAction;
  targetType: "user" | "feedback";
  targetId?: string | null;
  targetLabel?: string | null;
  detail?: string | null;
}): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: entry.adminEmail,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId ?? null,
        targetLabel: entry.targetLabel ?? null,
        detail: entry.detail ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to write admin audit log:", error);
  }
}
