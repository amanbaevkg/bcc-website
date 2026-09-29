import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const locales = [
  { code: 'en', lang: 'en', about: 'About Us' },
  { code: 'fr', lang: 'fr', about: 'À propos' },
  { code: 'de', lang: 'de', about: 'Über uns' },
  { code: 'lu', lang: 'lb', about: 'Iwwer eis' },
] as const;

test('root redirects to a language prefix', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
});

for (const l of locales) {
  test(`/${l.code} renders in its language without CSP violations`, async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (m) => {
      if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
    });
    page.on('pageerror', (e) => violations.push(e.message));

    await page.goto(`/${l.code}`);
    await expect(page.locator('html')).toHaveAttribute('lang', l.lang);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('footer')).toContainText(l.about);
    expect(violations).toEqual([]);
  });
}

test('language selector keeps the current page', async ({ page, isMobile }) => {
  await page.goto('/en/privacy');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Deutsch' }).click();
  } else {
    await page.getByRole('button', { name: /Change language/ }).click();
    await page
      .getByRole('link', { name: /Deutsch/ })
      .first()
      .click();
  }
  await expect(page).toHaveURL(/\/de\/privacy$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('language dropdown works with the keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The dropdown is replaced by the mobile menu on small screens.');
  await page.goto('/en');
  const button = page.getByRole('button', { name: /Change language/ });
  await button.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('link', { name: /English/ }).first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
});

test('unknown pages return 404 inside the site chrome', async ({ page }) => {
  const res = await page.goto('/fr/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
});

test('security headers are present', async ({ request }) => {
  const res = await request.get('/en');
  const h = res.headers();
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-powered-by']).toBeUndefined();
  expect(h['x-robots-tag']).toContain('noindex');
});

test('no horizontal scroll and no axe violations', async ({ page }) => {
  for (const path of ['/en', '/lu/legal-notice']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(
      axe.violations.map((v) => `${v.id}: ${v.help}`),
      path,
    ).toEqual([]);
  }
});
