import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@payload-config': fileURLToPath(new URL('./src/payload.config.ts', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // "server-only" throws outside React Server Components; tests run server code directly.
      'server-only': fileURLToPath(new URL('./test/empty.ts', import.meta.url)),
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
    // The admin round-trip test starts Payload on a temporary database.
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
