import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = { title: 'À propos' };

export default function Page() {
  return <PageIntro label="À propos" title="Designer produit. Et la marque qui va avec." description="Depuis plus de dix ans, je conçois des produits numériques et les identités qui les portent." />;
}
