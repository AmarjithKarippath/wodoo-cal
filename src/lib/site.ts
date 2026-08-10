export const PRODUCTION_SITE_URL = "https://www.wodoo.live";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || PRODUCTION_SITE_URL
  );
}
