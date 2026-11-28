import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = { title: 'Contact' };

export default function Page() {
  return <PageIntro label="Contact" title="Parlons de votre projet." description="Trois questions suffisent pour commencer. Réponse sous 48 h ouvrées." />;
}
