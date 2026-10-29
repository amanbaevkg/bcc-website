import path from 'node:path'
import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { aboutFallback } from '../content/fallback/about'
import { publicDir } from '../payload/seed'

/*
 * Data only, no schema change: the new photo at the top of About Us (the building's front and
 * its forecourt). Replaces the photo in the admin only where it is still the one imported at
 * first start (the home video's poster); a photo an editor chose stays as it is.
 */
const original = /^hero-poster(-\d+)?\.jpg$/

type Media = { id: number | string; filename?: string | null } | number | string | null | undefined

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const about = (await payload.findGlobal({ slug: 'about', depth: 1, locale: 'en', req })) as {
    hero?: { title?: string | null; image?: Media }
  }
  // A new site: the first-start import brings the new photo.
  if (!about?.hero?.title) return
  const current = about.hero.image
  if (!current || typeof current !== 'object' || !original.test(current.filename ?? '')) return

  try {
    const { src, alt, hotspot } = aboutFallback.hero.image
    const doc = await payload.create({
      collection: 'media',
      data: {
        alt: alt.en,
        ...(hotspot ? { focalX: hotspot.x * 100, focalY: hotspot.y * 100 } : {}),
      },
      filePath: path.join(publicDir(), src.replace(/^\//, '')),
      locale: 'en',
      req,
    })
    for (const loc of ['fr', 'de', 'lu'] as const) {
      if (!alt[loc]) continue
      await payload.update({ collection: 'media', id: doc.id, data: { alt: alt[loc] }, locale: loc, req })
    }
    await payload.updateGlobal({
      slug: 'about',
      data: { hero: { image: doc.id } } as never,
      locale: 'en',
      depth: 0,
      req,
    })
  } catch (error) {
    // The site keeps the earlier photo; the new one can be chosen under About Us → Hero.
    payload.logger.error({ err: error }, '[admin] the new About Us photo could not be set')
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // The earlier photo stays in the photo library; choose it again under About Us if needed.
}
