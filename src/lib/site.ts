export const SITE_URL = process.env.SITE_URL ?? "https://www.jlupholstery.com";

export function getSiteUrl(): URL {
  return new URL(SITE_URL);
}
