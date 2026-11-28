import type { ProjectCardProps, ProjectCategory } from '@fhaaabile/fm-design-system';
import { clean, img, list } from '@/sanity/clean';

interface CardData {
  title: string;
  href: string;
  client: string | null;
  year: string | null;
  cover: { src: string | null; alt: string | null } | null;
  coverRatio?: string | null;
  categories: { label: string; swatch: 'accent' | 'secondary' | 'tertiary' | null; slug: string }[] | null;
}

/** Catégories d'un projet → pastilles des composants, avec le filtre de la page Projets en lien. */
export function toCategories(categories: CardData['categories']): ProjectCategory[] {
  return list(categories).map((c) => ({ label: c.label, swatch: clean(c.swatch) ?? undefined, href: `/projets?tag=${encodeURIComponent(clean(c.label))}` }));
}

/** Projet lu dans Sanity → props communes de ProjectCard (accueil, page Projets). */
export function toCard(p: CardData): Pick<ProjectCardProps, 'title' | 'href' | 'cover' | 'client' | 'year' | 'categories' | 'coverRatio'> {
  return {
    title: p.title,
    href: clean(p.href),
    cover: img(p.cover, p.title) ?? { src: '', alt: '' },
    client: p.client ?? undefined,
    year: clean(p.year) ?? undefined,
    categories: toCategories(p.categories),
    coverRatio: clean(p.coverRatio) ?? undefined,
  };
}
