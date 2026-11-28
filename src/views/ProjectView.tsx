'use client';

import { PortableText, type PortableTextComponents } from 'next-sanity';
import {
  Avatar,
  ChapterNav,
  KeyFigures,
  Page,
  PageBand,
  PageBody,
  PageCase,
  ProjectChapter,
  ProjectHero,
  ProjectMedia,
  ProjectPagination,
  ScrollProgress,
  Testimonials,
  TOOL_LOGOS,
  type ToolName,
} from '@fhaaabile/fm-design-system';
import { SiteDisciplineBar, SiteDock } from '@/components/SiteDock';
import { clean, img, list } from '@/sanity/clean';
import type { ProjectQueryResult } from '@/sanity/sanity.types';
import { toCategories } from './project-card';

type Project = NonNullable<ProjectQueryResult>;

/** Texte riche d'un chapitre : paragraphes, intertitres, listes, citations et liens, dans la typographie des chapitres. */
const RICH_TEXT: PortableTextComponents = {
  block: {
    h3: ({ children }) => <h3 className="fm-text-heading-s">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="site-case-quote">{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = clean((value as { href?: string } | undefined)?.href) ?? '#';
      const external = /^https?:/.test(href);
      return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {children}
        </a>
      );
    },
  },
};

/** Environ 200 mots par minute, chapitres et introduction compris. */
function readingTime(project: Project) {
  const words = [project.intro ?? '', ...list(project.chapters).flatMap((c) => [c.title, ...list(c.body).flatMap((b) => list(b.children).map((s) => s.text ?? ''))])]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min de lecture`;
}

function toolTag(name: string) {
  const key = clean(name).toLowerCase().replace(/\s+/g, '') as ToolName;
  return key in TOOL_LOGOS ? { label: name, logo: key } : name;
}

/**
 * Étude de cas, lue dans Sanity : héros épinglé (le geste fort de la page), chiffres clés qui passent par-dessus, sommaire
 * ancré et chapitres, témoignage, projets précédent et suivant.
 */
export function ProjectView({ project }: { project: Project }) {
  const chapters = list(project.chapters).map((c, i) => ({ ...c, id: `chapitre-${i + 1}`, index: String(i + 1).padStart(2, '0') }));
  const figures = list(project.figures).map((f) => ({ value: clean(f.value), label: f.label, description: f.description ?? undefined, media: img(f.media) }));
  const categories = toCategories(project.categories);
  const skills = list(project.skills);
  const tools = list(project.tools);
  const meta = [...(clean(project.year) ? [{ label: 'Année', value: clean(project.year)! }] : []), ...(project.client ? [{ label: 'Client', value: project.client }] : []), ...list(project.meta)];
  const live = clean(project.liveLink?.href);
  const thumbnail = img(project.thumbnail, project.title);
  const prev = project.pagination?.previous;
  const next = project.pagination?.next;
  const tagGroups = [
    categories.length && { title: 'Type', collapsible: true, defaultOpen: true, tags: categories },
    skills.length && { title: 'Compétences', collapsible: true, tags: skills },
    tools.length && { title: 'Outils', collapsible: true, tags: tools.map(toolTag) },
  ].filter((g): g is Exclude<typeof g, 0> => Boolean(g));

  return (
    <Page id="top">
      <ScrollProgress targetId="site-case-study" />
      <SiteDock
        sections={chapters.length ? chapters.map((c) => ({ id: c.id, label: c.label })) : [{ id: 'top', label: project.title }]}
        revealAt=".fm-page__case"
        contextLogo
        back={{ label: 'Retour aux projets', href: '/projets' }}
      />
      <PageBody>
        <ProjectHero
          title={project.title}
          cover={clean(project.heroCover) ? { src: clean(project.heroCover)! } : undefined}
          thumbnail={thumbnail && live ? { src: thumbnail.src, alt: thumbnail.alt ?? project.title } : undefined}
          liveLink={live ? { label: project.liveLink!.label, href: live } : undefined}
          clientLogo={project.client ? <Avatar name={project.client} size="l" shape="rounded" tone="accent" decorative /> : undefined}
          meta={meta}
          categories={categories}
          role={project.role ?? undefined}
        />
        <div className="fm-project-hero-over">
          {figures.length > 0 && (
            <PageBand flush inset style={{ paddingBottom: 0 }}>
              <KeyFigures id="project-figures" columns={figures.length >= 4 ? 4 : figures.length === 3 ? 3 : 2} figures={figures} />
            </PageBand>
          )}
          {chapters.length > 0 && (
            <PageCase
              contentId="site-case-study"
              nav={
                <ChapterNav
                  className="fm-page__text-start fm-page__sticky"
                  readingTime={readingTime(project)}
                  chapters={chapters.map((c) => ({ id: c.id, index: c.index, label: c.label }))}
                  figures={figures.length ? { items: figures.map((f) => ({ value: f.value, label: f.label })), source: '#project-figures', motion: 'fly' } : undefined}
                  tagGroups={tagGroups}
                />
              }
            >
              {chapters.map((c, i) => {
                const media = list(c.media).map((m, k) => {
                  const image = img(m.image, '');
                  const video = clean(m.video?.src);
                  return (
                    <ProjectMedia
                      key={k}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      ratio={clean(m.ratio) ?? '16 / 9'}
                      framed={m.framed ?? false}
                      scrollZoom={m.scrollZoom ?? false}
                      caption={m.caption ?? undefined}
                      image={image && { src: image.src, alt: image.alt ?? '' }}
                      video={video ? { src: video, poster: clean(m.video?.poster) ?? undefined, label: m.video?.label ?? '' } : undefined}
                    />
                  );
                });
                const chapterFigures = list(c.figures).map((f) => ({ value: clean(f.value), label: f.label, description: f.description ?? undefined }));
                return (
                  <ProjectChapter key={c.id} id={c.id} index={c.index} label={c.label} title={c.title} media={media.length > 1 ? <div className="site-case-media">{media}</div> : media[0]}>
                    {i === 0 && project.intro && <p className="fm-text-body-l site-case-lead">{project.intro}</p>}
                    {c.body && <PortableText value={c.body} components={RICH_TEXT} />}
                    {chapterFigures.length > 0 && <KeyFigures columns={chapterFigures.length >= 4 ? 4 : chapterFigures.length === 3 ? 3 : 2} figures={chapterFigures} />}
                  </ProjectChapter>
                );
              })}
            </PageCase>
          )}
          {project.testimonial && (
            <PageBand ruled inset>
              <Testimonials className="fm-page__inset" items={[{ quote: project.testimonial.quote, name: project.testimonial.name, role: project.testimonial.role, company: project.testimonial.company, avatar: clean(project.testimonial.avatar) ?? undefined }]} />
            </PageBand>
          )}
          {(prev || next) && (
            <ProjectPagination
              previous={prev ? { title: prev.title, href: clean(prev.href), cover: img(prev.cover) && { src: img(prev.cover)!.src } } : undefined}
              next={next ? { title: next.title, href: clean(next.href), cover: img(next.cover) && { src: img(next.cover)!.src } } : undefined}
            />
          )}
          <SiteDisciplineBar />
        </div>
      </PageBody>
    </Page>
  );
}
