/**
 * Locale-aware accessors for content collections (`games`, `members`).
 *
 * Authoring model: the default-locale (EN) entry is the source of truth. Other
 * locales declare only the fields they override; this module merges the locale
 * entry on top of the EN entry so consumers get a single fully-populated object.
 *
 * Merge rules:
 *   - Scalars & arrays → locale value replaces EN value (arrays are not concatenated).
 *   - Plain objects (`stores`, `ui`) → deep-merged, key by key.
 *   - `undefined` in the locale entry is treated as "no override" → keep EN.
 *   - The MDX body is NOT merged. Each locale renders its own body; we keep a
 *     reference to the locale entry (or the EN entry if no locale file exists)
 *     so callers can `render()` the correct body.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from './utils';

type GameEntry = CollectionEntry<'games'>;
type MemberEntry = CollectionEntry<'members'>;

export interface LocalizedGame {
  /** Entry whose MDX body should be rendered for this locale. */
  entry: GameEntry;
  /** EN data with the locale overrides applied on top. */
  data: GameEntry['data'];
}

export interface LocalizedMember {
  entry: MemberEntry;
  data: MemberEntry['data'];
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Deep-merge `override` over `base`. Arrays are replaced, not concatenated. */
function deepMerge<T>(base: T, override: Partial<T> | undefined): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    if (value === undefined) continue;
    const baseValue = out[key];
    if (isPlainObject(value) && isPlainObject(baseValue)) {
      out[key] = deepMerge(baseValue, value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

/**
 * Load all games for a locale, each merged against its EN base.
 * Sorted by `order` (missing order → 0).
 */
export async function getLocalizedGames(locale: Locale): Promise<LocalizedGame[]> {
  const all = await getCollection('games');
  const bases = all.filter((e) => e.data.locale === DEFAULT_LOCALE);

  const merged = bases.map<LocalizedGame>((enEntry) => {
    const override =
      locale === DEFAULT_LOCALE
        ? undefined
        : all.find(
            (e) => e.data.gameId === enEntry.data.gameId && e.data.locale === locale,
          );
    const data: GameEntry['data'] = override
      ? { ...deepMerge(enEntry.data, override.data), locale }
      : enEntry.data;
    return { entry: override ?? enEntry, data };
  });

  return merged.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
}

/** Same as getLocalizedGames, for a single gameId. Returns null if unknown. */
export async function getLocalizedGame(
  gameId: string,
  locale: Locale,
): Promise<LocalizedGame | null> {
  const games = await getLocalizedGames(locale);
  return games.find((g) => g.data.gameId === gameId) ?? null;
}

/** Load all members for a locale, merged against their EN base. */
export async function getLocalizedMembers(locale: Locale): Promise<LocalizedMember[]> {
  const all = await getCollection('members');
  const bases = all.filter((e) => e.data.locale === DEFAULT_LOCALE);

  const merged = bases.map<LocalizedMember>((enEntry) => {
    const override =
      locale === DEFAULT_LOCALE
        ? undefined
        : all.find(
            (e) => e.data.memberId === enEntry.data.memberId && e.data.locale === locale,
          );
    const data: MemberEntry['data'] = override
      ? { ...deepMerge(enEntry.data, override.data), locale }
      : enEntry.data;
    return { entry: override ?? enEntry, data };
  });

  return merged.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
}
