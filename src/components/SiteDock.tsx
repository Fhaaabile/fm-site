'use client';

import { CITY_PLACES, DisciplineBar, Dock, type DockProps, type DockSection } from '@fhaaabile/fm-design-system';
import { useChrome } from './SiteChrome';

/** Dock d'une page : il prend le relais de l'en-tête au défilement et suit ses sections. */
export function SiteDock({ sections, ...rest }: { sections: DockSection[] } & Omit<DockProps, 'sections' | 'cta' | 'onMenu' | 'menuOpen'>) {
  const chrome = useChrome();
  return <Dock sections={sections} homeHref="/" cta={chrome.cta} onMenu={chrome.openMenu} menuOpen={chrome.menuOpen} {...rest} />;
}

/** Barre des disciplines : disciplines, horloge de l'atelier, réseaux, thème. Rien si aucune discipline n'est saisie. */
export function SiteDisciplineBar() {
  const chrome = useChrome();
  if (!chrome.disciplines.length) return null;
  return <DisciplineBar variant="cells" disciplines={chrome.disciplines} clock={{ timeZone: chrome.timeZone, places: CITY_PLACES }} socials={chrome.socials} />;
}
