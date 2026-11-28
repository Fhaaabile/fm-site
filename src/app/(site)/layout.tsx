import type { ReactNode } from 'react';
import '@fhaaabile/fm-design-system/fonts.css';
import '@fhaaabile/fm-design-system/styles.css';
import './site.css';
import { SiteChrome } from '@/components/SiteChrome';

/** Pages du site : styles du design system et décor commun (en-tête, rails, pied de page « Parlons-en »). */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
