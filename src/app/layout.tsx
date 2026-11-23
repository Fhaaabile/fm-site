import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fhaaabile/fm-design-system/fonts.css';
import '@fhaaabile/fm-design-system/styles.css';
import './site.css';
import { SiteChrome } from '@/components/SiteChrome';
import { SITE } from '@/content/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${SITE.name} — Designer produit et marque`, template: `%s — ${SITE.name}` },
  description: `${SITE.promise} Designer produit senior, de la recherche à l'identité visuelle.`,
  // Le staging ne doit pas être indexé ; la production l'autorisera au lancement.
  robots: process.env.VERCEL_ENV === 'production' ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#101112',
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
