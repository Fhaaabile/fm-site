'use client';

import { ArrowRight } from '@phosphor-icons/react';
import {
  AnimatedIcon,
  Button,
  Hero,
  LogoCloud,
  Manifesto,
  Masonry,
  MediaStage,
  Page,
  PageBand,
  PageBody,
  PageGrid,
  PageSection,
  ProjectCard,
  ProjectMedia,
  SectionHeader,
  ServiceRow,
  SkillTicker,
  Testimonials,
  TextRotator,
  type AnimatedIconName,
  type CardTone,
} from '@fhaaabile/fm-design-system';
import { SiteDisciplineBar, SiteDock } from '@/components/SiteDock';
import { useChrome } from '@/components/SiteChrome';
import { clean, img, list } from '@/sanity/clean';
import { toCard } from './project-card';

import type { Home } from '@/sanity/clean';

/**
 * Accueil, lu dans Sanity : héros (le geste fort de la page), barre des disciplines, logos, services, projets, compétences,
 * Lab, convictions, témoignages. Une section sans contenu ne s'affiche pas ; les numéros suivent les sections présentes.
 */
export function HomeView({ home }: { home: Home | null }) {
  const chrome = useChrome();
  const projects = list(home?.projects).length ? list(home?.projects) : list(home?.latest);
  const services = list(home?.services);
  const clients = list(home?.clients);
  const skillRows = list(home?.skillRows).map((row) => list(row).map((item) => ({ label: item.label, tone: (clean(item.tone) ?? undefined) as CardTone | undefined })));
  const lab = list(home?.lab);
  const manifesto = list(home?.manifesto);
  const testimonials = list(home?.testimonials).map((t) => ({ quote: t.quote, name: t.name, role: t.role ?? '', company: t.company ?? '', avatar: clean(t.avatar) ?? undefined }));
  const words = list(home?.words);
  const lead = projects[0];

  const sections = [
    services.length && { id: 'services', label: 'Services' },
    projects.length && { id: 'projets', label: 'Projets' },
    lab.length && { id: 'lab', label: 'Lab' },
    manifesto.length && { id: 'convictions', label: 'Convictions' },
    testimonials.length && { id: 'temoignages', label: 'Témoignages' },
  ].filter((s): s is { id: string; label: string } => Boolean(s));
  const index = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');

  return (
    <Page id="top">
      <SiteDock sections={sections.length ? sections : [{ id: 'top', label: 'Accueil' }]} revealAt="[data-fm-dock-anchor]" revealEdge="middle" />
      <PageBody>
        <Hero
          glow="sweep"
          status={chrome.availability}
          title={
            home?.title ? (
              <>
                {home.title}
                {words.length > 0 && (
                  <>
                    {' '}
                    <em>
                      <TextRotator words={words} />
                    </em>
                  </>
                )}
              </>
            ) : (
              'Des produits clairs, des marques qui se retiennent.'
            )
          }
          description={home?.intro ?? undefined}
          actions={
            projects.length > 0 && (
              <Button lift textRoll variant="secondary" trailingIcon={ArrowRight} href="#projets">
                Voir les projets
              </Button>
            )
          }
          media={lead && img(lead.cover) ? <MediaStage image={{ src: img(lead.cover)!.src, alt: '' }} caption={lead.title} /> : undefined}
        />
        <SiteDisciplineBar />
        {clients.length > 0 && (
          <PageBand inset>
            <LogoCloud layout="marquee" bordered={false} title="Ils m’ont fait confiance" items={clients.map((c) => ({ name: c.name, logo: clean(c.logo) ? <img src={clean(c.logo)!} alt="" /> : undefined }))} />
          </PageBand>
        )}
        {services.length > 0 && (
          <PageSection id="services" data-fm-dock-anchor="">
            <SectionHeader className="fm-page__intro" index={index('services')} label="Services" title="La clarté, jusque dans les détails." description="De la première question à la dernière interaction." />
            <div>
              {services.map((s, i) => {
                const icon = clean(s.icon) as AnimatedIconName | null;
                return (
                  <ServiceRow
                    key={s.title}
                    number={String(i + 1).padStart(2, '0')}
                    title={s.title}
                    description={s.description}
                    details={list(s.details)}
                    preview={img(s.preview)}
                    icon={icon ? <AnimatedIcon name={icon} size="l" host=".fm-service-row" /> : undefined}
                  />
                );
              })}
            </div>
          </PageSection>
        )}
        {projects.length > 0 && (
          <PageSection id="projets" {...(services.length ? {} : { 'data-fm-dock-anchor': '' })}>
            <SectionHeader className="fm-page__intro" index={index('projets')} label="Projets choisis" title="Quelques projets qui prennent vie." description="Des produits numériques utiles, avec une intention et un parti pris." />
            <PageGrid>
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  {...toCard(p)}
                  cursorLabel="Voir le projet"
                  loading={i < 3 ? 'eager' : 'lazy'}
                  revealDelay={i === 0 ? 0 : ((i - 1) % 2) * 3}
                  revealEffect="clip"
                  variant="image"
                  coverRatio={i === 0 ? '21 / 9' : '3 / 2'}
                  style={i === 0 ? { gridColumn: '1 / -1' } : undefined}
                />
              ))}
            </PageGrid>
            <div className="fm-page__intro">
              <Button variant="secondary" trailingIcon={ArrowRight} href="/projets">
                Tous les projets
              </Button>
            </div>
          </PageSection>
        )}
        {skillRows.length > 0 && (
          <PageBand>
            <SkillTicker rows={skillRows} />
          </PageBand>
        )}
        {lab.length > 0 && (
          <PageSection id="lab">
            <SectionHeader className="fm-page__intro" index={index('lab')} label="Le Lab" title="Un peu de place pour explorer." description="Projets personnels, expérimentations et idées à explorer." />
            <Masonry stickyEnds>
              {lab.slice(0, 6).map((item, i) => {
                const image = img(item.media?.image, item.title);
                const video = clean(item.media?.video?.src);
                const media = { ratio: clean(item.media?.ratio) ?? '4 / 3', image: image && { src: image.src, alt: image.alt ?? '' }, video: video ? { src: video, poster: clean(item.media?.video?.poster) ?? undefined, label: item.media?.video?.label ?? item.title } : undefined };
                return (
                  <figure key={`${item.title}-${i}`} className="site-lab-item">
                    <ProjectMedia {...media} caption={[item.title, item.kind, item.year].filter(Boolean).join(' · ')} revealEffect="rise" />
                  </figure>
                );
              })}
            </Masonry>
          </PageSection>
        )}
        {manifesto.length > 0 && (
          <PageSection id="convictions">
            <SectionHeader className="fm-page__intro" index={index('convictions')} label="Convictions" title="Ce en quoi je crois." description="Les principes qui guident chaque projet, du premier atelier à la mise en ligne." />
            <Manifesto className="fm-page__inset" items={manifesto.map((m) => ({ title: m.title, description: m.description ?? undefined }))} />
          </PageSection>
        )}
        {testimonials.length > 0 && (
          <PageSection id="temoignages">
            <SectionHeader className="fm-page__intro" index={index('temoignages')} label="Témoignages" title="Ils en parlent mieux que moi." description="Quelques mots des équipes avec qui j’ai travaillé." />
            <Testimonials className="fm-page__inset" items={testimonials} />
          </PageSection>
        )}
      </PageBody>
    </Page>
  );
}
