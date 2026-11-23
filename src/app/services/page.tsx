import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = { title: 'Services' };

export default function Page() {
  return <PageIntro label="Services" title="Du produit à la marque." description="Concevoir ce qu’il faut faire, puis lui donner une forme qu’on retient. Les deux, ou l’un des deux." />;
}
