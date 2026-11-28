import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = { title: 'Lab' };

export default function Page() {
  return <PageIntro label="Lab" title="Essayer avant d’en avoir besoin." description="Prototypes, outils et petites choses animées. Ce qui marche ici finit souvent dans un projet client." />;
}
