// Commandes Sanity en local (`npx sanity …`) : extraction du modèle et génération des types.
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91cstvku',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  typegen: { path: './src/sanity/queries.ts', schema: './src/sanity/schema.json', generates: './src/sanity/sanity.types.ts' },
});
