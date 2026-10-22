import { expect, test } from '@playwright/test';

/** How often the header switched between shown and hidden while the page scrolled. */
async function scrollAndCountSwitches(page: import('@playwright/test').Page, steps: number[]) {
  return page.evaluate(async (list) => {
    const header = document.querySelector('header')!;
    const hidden = () => header.className.includes('away');
    let last = hidden();
    let switches = 0;
    for (const dy of list) {
      window.scrollBy(0, dy);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (hidden() !== last) {
        switches++;
        last = hidden();
      }
    }
    return { switches, hidden: last };
  }, steps);
}

test('the header does not flicker while a phone scrolls in small steps', async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => window.scrollTo(0, 600));
  // Start with the header shown: a clear scroll up.
  expect((await scrollAndCountSwitches(page, Array(10).fill(-4))).hidden).toBe(false);
  // Down in small, uneven steps with tiny bounces back, as a phone's momentum scroll does.
  const down = Array.from({ length: 160 }, (_, i) => [5, 2, 3, -1][i % 4]);
  const goingDown = await scrollAndCountSwitches(page, down);
  expect(goingDown).toEqual({ switches: 1, hidden: true });

  // A small scroll up keeps it hidden; a clear scroll up brings it back once.
  expect(await scrollAndCountSwitches(page, [-4, -4, -4])).toEqual({ switches: 0, hidden: true });
  expect(await scrollAndCountSwitches(page, Array(15).fill(-4))).toEqual({
    switches: 1,
    hidden: false,
  });
});

test('the page behind the phone menu does not scroll', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The full-screen menu is for phones.');
  await page.goto('/en');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
