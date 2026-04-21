/**
 * Locale-aware link helpers for game storefronts.
 *
 * These read the `games` collection through the merge helper so authors only
 * maintain URLs in one place (the EN MDX frontmatter) and every surface —
 * footer, hero, newsletter — picks them up automatically.
 *
 * Locale: plain .ts modules can't read `Astro.currentLocale`, so the caller
 * passes it explicitly. In .astro files that usually looks like:
 *     const url = await steamWishlistLink('velvet-door', locale);
 */

import { getLocalizedGame } from './content';
import type { Locale } from './utils';

/**
 * Steam store language query param. Steam accepts `?l=<language>` to localize
 * the store page. Extend this map when a new locale is added to LOCALES.
 */
const STEAM_LANG_PARAM: Record<Locale, string> = {
  en: 'english',
  fr: 'french',
};

/** Append (or replace) Steam's `?l=` language param, non-destructively. */
function withSteamLang(url: string, locale: Locale): string {
  try {
    const u = new URL(url);
    u.searchParams.set('l', STEAM_LANG_PARAM[locale]);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Resolve the Steam wishlist / store URL for a given game, localized.
 *
 * Returns `null` when the game entry is missing, or when its Steam store is
 * disabled or has no URL. Callers should fall back gracefully (hide the link,
 * swap to a placeholder, …) rather than render `null`.
 */
export async function steamWishlistLink(
  gameId: string,
  locale: Locale,
): Promise<string | null> {
  const game = await getLocalizedGame(gameId, locale);
  const steam = game?.data.stores?.steam;
  if (!steam?.enabled || !steam.url) return null;
  return withSteamLang(steam.url, locale);
}
