'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Footer, Header, MotionProvider, PageRails, ToastProvider } from '@fhaaabile/fm-design-system';
import { CTA, FOOTER_COLUMNS, NAV, SITE } from '@/content/site';

/** Décor commun : en-tête, rails, pied de page « Parlons-en ». Les pages ne remettent pas d'appel en plus (D-103). */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))?.href ?? (pathname === '/contact' ? '/contact' : undefined);
  return (
    <MotionProvider>
      <ToastProvider>
        <PageRails />
        <Header items={NAV} cta={CTA} homeHref="/" currentHref={current} ctaVisibility="always" />
        <main className="site-main">{children}</main>
        <Footer
          title={
            <>
              Parlons<em>-en.</em>
            </>
          }
          description="Un produit à clarifier ou une marque à faire exister ? Écrivez-moi, réponse sous 48 h ouvrées."
          email={SITE.email}
          cta={{ label: 'Écrire un e-mail', href: `mailto:${SITE.email}` }}
          columns={FOOTER_COLUMNS}
          copyright={`© ${SITE.name}`}
          backToTop
        />
      </ToastProvider>
    </MotionProvider>
  );
}
