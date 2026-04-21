import { defineCollection, z } from 'astro:content';

/**
 * Collection `legal` — one MDX entry per (locale × document).
 *
 * urlSlug    : the locale-specific URL segment (/en/legal/, /fr/mentions-legales/ …)
 *              NB: `slug` is a reserved field in Astro content collections (auto-computed
 *              from the filename), so we use `urlSlug` for our custom URL segment.
 * canonical  : document key matching SLUG_MAP ('legal' | 'eula' | 'privacy')
 * locale     : 'en' | 'fr'
 * lastUpdated: z.coerce.date() because YAML bare dates (2026-04-18) are parsed
 *              as Date objects before Zod sees them.
 */
const legal = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    canonical: z.enum(['legal', 'eula', 'privacy']),
    urlSlug: z.string(),
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

/**
 * Collection `games` — one MDX entry per (game × locale).
 *
 * Authoring model: the **default-locale entry (EN)** is the source of truth.
 * Non-default locales (`velvet-door.fr.mdx`, …) declare only the fields they
 * override; every other field is inherited from the EN entry via the merge
 * helper in src/i18n/content.ts (`getLocalizedGames`).
 *
 * Consequence for this schema: only `locale` and `gameId` are required. Every
 * other field is optional so locale overrides can stay minimal. The EN entry
 * should still carry the full set of fields — this invariant is a convention,
 * not enforced by Zod, because a single collection cannot have per-locale
 * schemas.
 *
 * The MDX body carries the pitch prose and is NOT inherited — each locale
 * renders its own body.
 */
const games = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    gameId: z.string(),
    order: z.number().optional(),
    status: z
      .enum(['announced', 'in-development', 'early-access', 'released'])
      .optional(),

    // Display (locale-specific — usually overridden per locale)
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    tagline: z.string().optional(),
    pitchLede: z.string().optional(),

    // Feature cards (locale-specific)
    features: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
        }),
      )
      .optional(),

    /**
     * Storefront buttons — shared metadata, typically declared in EN only.
     * Per-store flags: enabled, comingSoon, url.
     * Button labels live in the global i18n dict (games.stores.<key>.*).
     */
    stores: z
      .object({
        steam: z
          .object({
            enabled: z.boolean().default(false),
            comingSoon: z.boolean().default(false),
            url: z.string().optional(),
          })
          .optional(),
        epic: z
          .object({
            enabled: z.boolean().default(false),
            comingSoon: z.boolean().default(false),
            url: z.string().optional(),
          })
          .optional(),
      })
      .optional(),

    pressKitUrl: z.string().optional(),

    // Gallery — shared; paths are locale-agnostic
    gallery: z.array(z.string()).optional(),

    // Locale-specific UI labels
    ui: z
      .object({
        pressKitAvailable: z.boolean().optional(),
        pressKit: z.string().optional(),
        galleryHint: z.string().optional(),
        pressKitNote: z.string().optional(),
      })
      .optional(),

    // Structured-data hints (shared)
    genre: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional(),
    minPlayers: z.number().optional(),
    maxPlayers: z.number().optional(),
  }),
});

/**
 * Collection `members` — one MDX entry per (member × locale).
 *
 * Same authoring model as `games`: EN is the source of truth, other locales
 * declare only what differs. See src/i18n/content.ts `getLocalizedMembers`.
 */
const members = defineCollection({
  type: 'content',
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    memberId: z.string(),
    order: z.number().optional(),

    name: z.string().optional(),
    role: z.string().optional(),
    avatar: z.string().optional(),
    avatarAlt: z.string().optional(),

    links: z
      .array(
        z.object({
          platform: z.enum(['bluesky', 'mastodon', 'github', 'discord', 'website']),
          label: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { legal, games, members };
