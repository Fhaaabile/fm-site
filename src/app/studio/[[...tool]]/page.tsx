import type { Metadata } from 'next';
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

// Le studio est une application à part entière, rendue dans le navigateur ; la page elle-même est statique.
export const dynamic = 'force-static';
export { viewport } from 'next-sanity/studio';

export const metadata: Metadata = {
  title: 'Studio',
  // Jamais indexé, même en production : l'accès demande une connexion Sanity.
  robots: { index: false, follow: false },
  referrer: 'same-origin',
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
