import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = { title: 'Projets' };

export default function Page() {
  return <PageIntro label="Projets" title="Le travail, produit d’abord." description="Études de cas produit et projets de marque, filtrables par discipline." />;
}
