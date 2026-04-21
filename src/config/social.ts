/**
 * Single source of truth for the studio's social / external links.
 *
 * Add new platforms here and import `SOCIAL_LINKS.<key>` wherever needed.
 * Keeps URL updates to one edit and avoids drift between Hero, Footer,
 * Roadmap, JSON-LD `sameAs`, etc.
 */
export const SOCIAL_LINKS = {
  discord: 'https://discord.gg/QBmZu3ds',
} as const;
