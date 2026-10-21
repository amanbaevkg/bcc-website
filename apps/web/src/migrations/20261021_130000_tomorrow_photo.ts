import path from 'node:path'
import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { homeFallback } from '../content/fallback/home'
import { publicDir } from '../payload/seed'

/*
 * Data only, no schema change: the new photo behind "Building tomorrow's now" (the ground
 * floor and its forecourt). Replaces the photo in the admin only where it is still the one
 * imported at first start; a photo an editor chose stays as it is.
 */
const original = /^building(-\d+)?\.jpg$/

type Media = { id: number | string; filename?: string | null } | number | string | null | undefined

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const home = (await payload.findGlobal({ slug: 'home', depth: 1, locale: 'en', req })) as {
    hero?: { title?: string | null }
    tomorrow?: { image?: Media }
  }
  // A new site: the first-start import brings the new photo.
  if (!home?.hero?.title) return
  const current = home.tomorrow?.image
  if (!current || typeof current !== 'object' || !original.test(current.filename ?? '')) return

  try {
    const { src, alt } = homeFallback.tomorrow.image
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt.en },
      filePath: path.join(publicDir(), src.replace(/^\//, '')),
      locale: 'en',
      req,
    })
    for (const loc of ['fr', 'de', 'lu'] as const) {
      if (!alt[loc]) continue
      await payload.update({ collection: 'media', id: doc.id, data: { alt: alt[loc] }, locale: loc, req })
    }
    await payload.updateGlobal({
      slug: 'home',
      data: { tomorrow: { image: doc.id } } as never,
      locale: 'en',
      depth: 0,
      req,
    })
  } catch (error) {
    // The site keeps the earlier photo; the new one can be chosen under Home → 4. Building tomorrow.
    payload.logger.error({ err: error }, '[admin] the new "Building tomorrow" photo could not be set')
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // The earlier photo stays in the photo library; choose it again under Home if needed.
}
