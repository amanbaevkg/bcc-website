import path from 'node:path'
import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { publicDir } from '../payload/seed'

/*
 * Data only, no schema change: the home page's new background video (October 2026: the
 * reception counter is gone, the mailroom part is newly filmed). Replaces the video in the
 * admin only where it is still the one imported at first start; a video an editor uploaded
 * stays as it is.
 */
const sizes = ['1080', '720', '480'] as const
const original = /^hero-(1080|720|480)(-\d+)?\.mp4$/

type Media = { id: number | string; filename?: string | null } | number | string | null | undefined

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const home = (await payload.findGlobal({ slug: 'home', depth: 1, locale: 'en', req })) as {
    hero?: { title?: string | null; video?: Record<string, Media> }
  }
  const video = home?.hero?.video
  // A new site: the first-start import brings the new video.
  if (!home?.hero?.title || !video) return

  try {
    const replace: Record<string, number | string> = {}
    for (const size of sizes) {
      const current = video[`mp4_${size}`]
      const builtIn = !!current && typeof current === 'object' && original.test(current.filename ?? '')
      if (!builtIn) continue
      const doc = await payload.create({
        collection: 'media',
        data: { alt: '' },
        filePath: path.join(publicDir(), 'media', 'hero', `hero-v2-${size}.mp4`),
        locale: 'en',
        req,
      })
      replace[`mp4_${size}`] = doc.id
    }
    if (!Object.keys(replace).length) {
      payload.logger.info('[admin] home video was changed in the admin: left as it is')
      return
    }
    await payload.updateGlobal({
      slug: 'home',
      data: { hero: { video: replace } } as never,
      locale: 'en',
      depth: 0,
      req,
    })
  } catch (error) {
    // The site keeps the earlier video; the new one can be chosen under Home → 1. Top.
    payload.logger.error({ err: error }, '[admin] the new home video could not be set')
  }
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // The earlier video stays in the photo library; choose it again under Home → Top if needed.
}
