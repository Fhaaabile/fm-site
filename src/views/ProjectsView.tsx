'use client';

import { Avatar, FeaturedProject, Page, PageBody, PageSection, ProjectIndex, SectionHeader } from '@fhaaabile/fm-design-system';
import { SiteDisciplineBar, SiteDock } from '@/components/SiteDock';
import { clean, list } from '@/sanity/clean';
import type { ProjectsQueryResult } from '@/sanity/sanity.types';
import { toCard } from './project-card';

/** Écrit un nombre en toutes lettres jusqu'à douze, comme dans le titre de la page. */
const WORDS = ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix', 'Onze', 'Douze'];

/**
 * Page Projets, lue dans Sanity : le projet à la une en héros, qui grandit au défilement (le geste fort de la page),
 * puis tous les projets, filtrables par leurs catégories et leurs compétences ; filtres gardés dans l'adresse.
 */
export function ProjectsView({ projects }: { projects: ProjectsQueryResult }) {
  const all = list(projects);
  const featured = all.find((p) => p.featured) ?? all[0];
  const count = all.length;
  const title = count === 0 ? 'Les projets arrivent bientôt.' : `${count <= 12 ? WORDS[count] : count} projet${count > 1 ? 's' : ''}, une même exigence.`;
  const featuredCard = featured && toCard(featured);

  return (
    <Page id="top">
      <SiteDock sections={[{ id: 'projets', label: 'Projets' }]} back={{ label: 'Retour à l’accueil', href: '/' }} revealAt=".fm-project-index__sentinel" />
      <PageBody>
        {featured && featuredCard && featuredCard.cover.src && (
          <FeaturedProject
            title={featured.title}
            href={featuredCard.href}
            cover={featuredCard.cover}
            intro={featured.intro ?? undefined}
            client={featuredCard.client}
            year={featuredCard.year}
            categories={featuredCard.categories}
            clientLogo={featured.client ? <Avatar name={featured.client} size="m" shape="rounded" tone="accent" decorative /> : undefined}
          />
        )}
        <PageSection id="projets">
          <SectionHeader as="h1" className="fm-page__intro" label="Projets" title={title} description="Produits, systèmes et marques : filtrez par étiquette pour aller à ce qui vous intéresse." />
          {count > 0 && (
            <ProjectIndex
              cursorLabel="Voir le projet"
              urlParam="tag"
              groupMode="click"
              projects={all.map((p) => ({
                id: clean(p.slug),
                ...toCard(p),
                disciplines: list(p.skills),
                flag: featured && p.slug === featured.slug ? 'À la une' : undefined,
              }))}
            />
          )}
        </PageSection>
        <SiteDisciplineBar />
      </PageBody>
    </Page>
  );
}
