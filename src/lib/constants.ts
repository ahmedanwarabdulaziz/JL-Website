/** Super admin emails – only these can access /admin */
export const ADMIN_EMAILS = [
  "ahmedanwarabdulaziz@gmail.com",
  "jl@jlupholstery.com",
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (email == null || typeof email !== "string") return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.trim().toLowerCase());
}
