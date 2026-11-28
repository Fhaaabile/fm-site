import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { client } from '@/sanity/client';
import { load } from '@/sanity/live';
import { projectQuery, projectSlugsQuery } from '@/sanity/queries';
import type { ProjectQueryResult, ProjectSlugsQueryResult } from '@/sanity/sanity.types';
import { ProjectView } from '@/views/ProjectView';

type Props = { params: Promise<{ slug: string }> };

/** Études de cas construites à l'avance ; une nouvelle adresse publiée après la construction est rendue à la demande. */
export async function generateStaticParams() {
  const slugs = await client.fetch<ProjectSlugsQueryResult>(projectSlugsQuery, {}, { perspective: 'published', stega: false });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await load<ProjectQueryResult>(projectQuery, { slug, locale: 'fr' }, { stega: false });
  if (!data) return {};
  const title = stegaClean(data.seo?.title) || data.title;
  const description = stegaClean(data.seo?.description) || data.intro || undefined;
  const image = data.seo?.image ?? data.cover?.src ?? undefined;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [{ url: image }] : undefined },
    robots: data.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const data = await load<ProjectQueryResult>(projectQuery, { slug, locale: 'fr' });
  if (!data) notFound();
  return <ProjectView project={data} />;
}
