import '@fhaaabile/fm-design-system/fonts.css';
import '@fhaaabile/fm-design-system/styles.css';
import './site.css';
import type { ReactNode } from 'react';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { SiteChrome } from '@/components/SiteChrome';
import { isSettings } from '@/sanity/clean';
import { SanityLive, load } from '@/sanity/live';
import { settingsQuery } from '@/sanity/queries';
import type { SettingsQueryResult } from '@/sanity/sanity.types';

/**
 * Décor des pages du site : réglages lus dans Sanity, mise à jour en direct des contenus publiés et, en mode brouillon
 * (aperçu du studio), repères cliquables sur chaque texte.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const data = await load<SettingsQueryResult>(settingsQuery, { locale: 'fr' });
  const { isEnabled: draft } = await draftMode();
  return (
    <>
      <SiteChrome settings={isSettings(data) ? data : null}>{children}</SiteChrome>
      <SanityLive />
      {draft && <VisualEditing />}
    </>
  );
}
