/**
 * i18n utilities for Improbability Works.
 *
 * Astro's native `astro:i18n` module handles:
 *   - Locale-prefixed URL generation (getRelativeLocaleUrl / getAbsoluteLocaleUrl)
 *   - Routing configuration (prefixDefaultLocale, redirectToDefaultLocale)
 *
 * This file provides what Astro does NOT cover out of the box:
 *   - Translation dictionary look-up  (t)
 *   - Translated-slug map             (SLUG_MAP) — "legal" ↔ "mentions-legales" etc.
 *   - hreflang <link> generation      (hreflangAlternates)
 *   - HTML lang attribute             (htmlLang)
 */

import en from './en.json';
import fr from './fr.json';

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

export type Locale = 'en' | 'fr';
export const LOCALES: Locale[] = ['en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries = { en, fr } as const;
export type Dictionary = typeof en;

// ---------------------------------------------------------------------------
// Translation function
// ---------------------------------------------------------------------------

/** Resolve a dotted key path against a dictionary object. */
function resolve(obj: unknown, parts: string[]): unknown {
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

/**
 * Translate a dotted-path key for a given locale.
 * Falls back to the default locale, then to the raw key.
 *
 * @example t('hero.ctaPrimary', 'fr') → "Découvrir Velvet Door"
 */
export function t(key: string, locale: Locale): string {
  const parts = key.split('.');
  const val = resolve(dictionaries[locale], parts) ?? resolve(dictionaries[DEFAULT_LOCALE], parts);
  return typeof val === 'string' ? val : key;
}

/** Return the full dictionary for a locale (useful when iterating arrays). */
export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

// ---------------------------------------------------------------------------
// Translated slug map
// ---------------------------------------------------------------------------

/**
 * Maps canonical slug keys to their locale-specific URL segments.
 * Used by:
 *   - LanguageSwitcher  (find the target-locale URL for the current page)
 *   - Footer            (build legal page URLs per locale)
 *   - hreflangAlternates (build <link rel="alternate"> sets)
 *   - getStaticPaths in [lang]/[slug].astro (via the MDX collection frontmatter)
 *
 * When adding a new document type:
 *   1. Add an entry here.
 *   2. Add 2 MDX files in src/content/legal/.
 *   3. No routing file changes needed.
 */
export const SLUG_MAP: Record<string, Record<Locale, string>> = {
  home:    { en: '',                  fr: '' },
  legal:   { en: 'legal',             fr: 'mentions-legales' },
  eula:    { en: 'eula',              fr: 'cluf' },
  privacy: { en: 'privacy',           fr: 'confidentialite' },
};

// ---------------------------------------------------------------------------
// SEO helpers
// ---------------------------------------------------------------------------

/**
 * Build the <link rel="alternate" hreflang="…"> set for a given canonical slug.
 * Injects one entry per locale + one x-default pointing to EN.
 */
/**
 * Build the locale path for a given locale + canonical slug.
 * Respects prefixDefaultLocale: false — EN has no prefix, other locales do.
 *
 * Examples (EN = default, no prefix):
 *   localePath('en', 'home')    → '/'
 *   localePath('en', 'legal')   → '/legal/'
 *   localePath('fr', 'home')    → '/fr/'
 *   localePath('fr', 'legal')   → '/fr/mentions-legales/'
 */
export function localePath(locale: Locale, slug: string): string {
  const seg = SLUG_MAP[slug]?.[locale] ?? '';
  if (locale === DEFAULT_LOCALE) {
    return seg ? `/${seg}/` : '/';
  }
  return seg ? `/${locale}/${seg}/` : `/${locale}/`;
}

export function hreflangAlternates(
  slug: string,
  origin: string,
): Array<{ hreflang: string; href: string }> {
  const result: Array<{ hreflang: string; href: string }> = [];

  for (const loc of LOCALES) {
    result.push({ hreflang: loc, href: origin + localePath(loc, slug) });
  }

  // x-default points to the default locale (EN at root).
  result.push({ hreflang: 'x-default', href: origin + localePath(DEFAULT_LOCALE, slug) });

  return result;
}

/** Return the BCP-47 language tag for use in <html lang="…">. */
export function htmlLang(locale: Locale): string {
  return locale === 'fr' ? 'fr-FR' : 'en-US';
}
