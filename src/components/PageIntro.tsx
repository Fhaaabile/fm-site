import type { ReactNode } from 'react';
import { SectionHeader } from '@fhaaabile/fm-design-system';

/** Titre de page (h1) sur la grille commune. Les sections viendront du design system, page par page. */
export function PageIntro({ label, title, description, children }: { label: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="site-page">
      <SectionHeader as="h1" label={label} title={title} description={description} />
      {children}
    </section>
  );
}
