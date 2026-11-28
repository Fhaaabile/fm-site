import '@fhaaabile/fm-design-system/fonts.css';
import '@fhaaabile/fm-design-system/styles.css';
import './(site)/site.css';
import { PageIntro } from '@/components/PageIntro';
import { SiteChrome } from '@/components/SiteChrome';
import { isSettings } from '@/sanity/clean';
import { load } from '@/sanity/live';
import { settingsQuery } from '@/sanity/queries';
import type { SettingsQueryResult } from '@/sanity/sanity.types';

/** Page introuvable : rendue hors du groupe `(site)`, elle reprend elle-même le décor du site. */
export default async function NotFound() {
  const data = await load<SettingsQueryResult>(settingsQuery, { locale: 'fr' }, { stega: false });
  return (
    <SiteChrome settings={isSettings(data) ? data : null}>
      <PageIntro label="Erreur 404" title="Cette page n’existe pas (ou plus)." description="Le menu en haut mène aux pages du site." />
    </SiteChrome>
  );
}
