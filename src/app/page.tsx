import { PageIntro } from '@/components/PageIntro';
import { SITE } from '@/content/site';

export default function Home() {
  return <PageIntro label={SITE.baseline} title={SITE.promise} description="Designer produit senior : je conçois des produits numériques et les marques qui vont avec, de la recherche au dernier pixel animé." />;
}
