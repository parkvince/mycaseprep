import { prisma } from "@/lib/prisma";

export const CASE_LIMIT = 2;
export const WINDOW_HOURS = 12;

export interface UsageStatus {
  allowed: boolean;
  unlimited?: boolean;
  casesUsed: number;
  casesRemaining: number | null;
  windowStart: Date | null;
  resetsAt: Date | null;
}

// Shared by /api/usage/check (what the dashboard displays) and /api/case/generate
// (what actually gates starting a new case) so the two can never drift apart —
// the display and the enforcement must always agree.
export async function getUsageStatus(userId: string): Promise<UsageStatus> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { unlimitedCases: true, bonusCases: true } });

  if (user?.unlimitedCases) {
    return { allowed: true, unlimited: true, casesUsed: 0, casesRemaining: null, windowStart: null, resetsAt: null };
  }

  const limit = CASE_LIMIT + (user?.bonusCases ?? 0);
  const usageRecord = await prisma.dailyUsage.findUnique({ where: { userId } });

  if (!usageRecord) {
    return { allowed: true, casesUsed: 0, casesRemaining: limit, windowStart: null, resetsAt: null };
  }

  const now = new Date();
  const windowStart = new Date(usageRecord.windowStart);
  const windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000);

  if (now > windowEnd) {
    await prisma.dailyUsage.update({ where: { userId }, data: { casesUsed: 0, windowStart: now } });
    return {
      allowed: true,
      casesUsed: 0,
      casesRemaining: limit,
      windowStart: now,
      resetsAt: new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000),
    };
  }

  const casesUsed = usageRecord.casesUsed;
  return {
    allowed: casesUsed < limit,
    casesUsed,
    casesRemaining: Math.max(0, limit - casesUsed),
    windowStart,
    resetsAt: windowEnd,
  };
}
