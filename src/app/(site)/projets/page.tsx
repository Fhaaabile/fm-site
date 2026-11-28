import type { Metadata } from 'next';
import { load } from '@/sanity/live';
import { projectsQuery } from '@/sanity/queries';
import type { ProjectsQueryResult } from '@/sanity/sanity.types';
import { ProjectsView } from '@/views/ProjectsView';

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Produits, systèmes et marques : une sélection de projets de design produit et de marque.',
};

export default async function ProjectsPage() {
  const projects = await load<ProjectsQueryResult>(projectsQuery, { locale: 'fr' });
  return <ProjectsView projects={projects} />;
}
