import { expect, test, type Page } from '@playwright/test';

const locales = ['en', 'fr', 'de', 'lu'];
const pages = ['', '/about', '/services', '/contact', '/news', '/privacy'];

/** Headings where a word is split across two lines, or that stick out of their column. */
async function brokenHeadings(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('h1, h2, h3, .xl')) {
      if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
      const right = el.getBoundingClientRect().left + el.scrollWidth;
      if (
        getComputedStyle(el).display !== 'inline' &&
        (el.scrollWidth > el.clientWidth + 1 || right > document.documentElement.clientWidth + 1)
      ) {
        problems.push(`too wide: "${el.textContent?.trim()}"`);
      }
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? '';
        for (const m of text.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          const tops = [...range.getClientRects()]
            .filter((r) => r.width > 0)
            .map((r) => Math.round(r.top));
          if (tops.length && Math.max(...tops) - Math.min(...tops) > 2) {
            problems.push(`split word: "${m[0]}"`);
          }
        }
      }
    }
    return problems;
  });
}

for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
  test(`no heading word is split across lines at ${width}px, in every language`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    for (const locale of locales) {
      for (const path of pages) {
        await page.goto(`/${locale}${path}`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(100);
        expect(await brokenHeadings(page), `/${locale}${path}`).toEqual([]);
      }
    }
  });
}
