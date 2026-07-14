// Single-owner admin gate - this app has exactly one operator account, so a
// hardcoded email check is the simplest correct mechanism. Revisit if/when
// admin access ever needs to be granted to more than one account.
export const ADMIN_EMAIL = "seho.vince@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
