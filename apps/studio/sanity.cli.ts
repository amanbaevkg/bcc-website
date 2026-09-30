import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8bx4pgzw',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
});
