import { expect, test } from '@playwright/test';

const scroll = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('region', { name }).evaluate((g) => g.scrollLeft);

for (const [path, name] of [
  ['/en', 'Our spaces gallery'],
  ['/en/contact', 'Photo gallery'],
] as const) {
  test(`${path}: the photos glide by on their own and stop under the mouse`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(path);
    const gallery = page.getByRole('region', { name });
    await gallery.scrollIntoViewIfNeeded();
    const start = await scroll(page, name);
    await expect.poll(() => scroll(page, name), { timeout: 5000 }).toBeGreaterThan(start + 20);

    test.skip(isMobile, 'Phones have no mouse to hover with.');
    await gallery.hover();
    await page.waitForTimeout(300);
    const held = await scroll(page, name);
    await page.waitForTimeout(1200);
    expect(Math.abs((await scroll(page, name)) - held)).toBeLessThan(2);
  });
}

test('no glide for visitors who ask for reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/en');
  const gallery = page.getByRole('region', { name: 'Our spaces gallery' });
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(await gallery.evaluate((g) => g.scrollLeft)).toBe(0);
  await context.close();
});
