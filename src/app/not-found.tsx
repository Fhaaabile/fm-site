import '@fhaaabile/fm-design-system/fonts.css';
import '@fhaaabile/fm-design-system/styles.css';
import './(site)/site.css';
import { PageIntro } from '@/components/PageIntro';
import { SiteChrome } from '@/components/SiteChrome';

/** Page introuvable : rendue hors du groupe `(site)`, elle reprend elle-même le décor du site. */
export default function NotFound() {
  return (
    <SiteChrome>
      <PageIntro label="Erreur 404" title="Cette page n’existe pas (ou plus)." description="Le menu en haut mène aux pages du site." />
    </SiteChrome>
  );
}
