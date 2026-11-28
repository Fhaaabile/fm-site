'use client';

// Studio Sanity du site, servi par Next.js à l'adresse /studio (D-125 du design system). Le modèle de contenu vient
// du dossier `cms/` du design system, qu'il remplace : chaque champ correspond à une prop d'un composant.
import { visionTool } from '@sanity/vision';
import { defineConfig, type DocumentActionComponent } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { resolve } from './src/sanity/presentation';
import { schemaTypes, SINGLETONS } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';
import { StudioLogo } from './src/sanity/StudioLogo';

const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'default',
  title: 'Fabien Michaud',
  icon: StudioLogo,
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ title: 'Contenu', structure }),
    // Aperçu en direct : la page du site à côté du formulaire, en mode brouillon ; un clic sur un texte ouvre son champ.
    presentationTool({ title: 'Aperçu', resolve, previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } } }),
    visionTool({ title: 'Requêtes', defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // Les réglages ne se créent pas depuis le bouton « Nouveau ».
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions: DocumentActionComponent[], { schemaType }) =>
      SINGLETONS.has(schemaType) ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : actions,
  },
});
