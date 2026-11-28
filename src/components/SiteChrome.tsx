'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Availability, CITY_PLACES, Footer, Header, MenuDrawer, MotionProvider, PageRails, ScrollEdges, ToastProvider, type AvailabilityStatus, type SocialNetwork } from '@fhaaabile/fm-design-system';
import { CTA, FOOTER_COLUMNS, NAV, SITE } from '@/content/site';
import { clean, img, list, type Settings } from '@/sanity/clean';

/** Ce que le décor partage avec les pages : réglages résolus et ouverture du menu (le Dock d'une page l'ouvre aussi). */
interface Chrome {
  name: string;
  email: string;
  cta: { label: string; href: string };
  socials: { network: SocialNetwork; href: string }[];
  disciplines: string[];
  timeZone: string;
  availability: ReactNode;
  menuOpen: boolean;
  openMenu: () => void;
}

const ChromeContext = createContext<Chrome | null>(null);

export function useChrome(): Chrome {
  const value = useContext(ChromeContext);
  if (!value) throw new Error('useChrome doit être utilisé dans SiteChrome.');
  return value;
}

/** Lien courant de la navigation, d'après l'adresse. */
function currentOf(pathname: string) {
  if (pathname === '/contact') return '/contact';
  return NAV.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))?.href;
}

/**
 * Décor commun : en-tête (qui cède la place au Dock d'une page au défilement), menu latéral, filets de marge, bords de
 * défilement et pied de page « Parlons-en ». Les pages ne remettent pas d'appel en plus. Les réglages viennent de
 * Sanity ; tant qu'un réglage manque, le site affiche le repli de `content/site.ts`.
 */
export function SiteChrome({ settings, children }: { settings: Settings | null; children: ReactNode }) {
  const pathname = usePathname();
  const current = currentOf(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const chrome = useMemo<Chrome>(() => {
    const status = (clean(settings?.availability?.status) ?? 'available') as AvailabilityStatus;
    const ctaHref = clean(settings?.cta?.href);
    return {
      name: settings?.name ?? SITE.name,
      email: clean(settings?.email) ?? SITE.email,
      cta: settings?.cta?.label && ctaHref ? { label: settings.cta.label, href: ctaHref } : CTA,
      socials: list(settings?.socials).flatMap((s) => {
        const network = clean(s.network);
        const href = clean(s.href);
        return network && href ? [{ network: network as SocialNetwork, href }] : [];
      }),
      disciplines: list(settings?.disciplines),
      timeZone: clean(settings?.timeZone) ?? 'Europe/Paris',
      availability: (
        <Availability status={status} detail={settings?.availability?.detail ?? undefined} href="/contact">
          {settings?.availability?.label ?? (status === 'available' ? 'Disponible' : status === 'limited' ? 'Disponibilité réduite' : 'Indisponible')}
        </Availability>
      ),
      menuOpen,
      openMenu: () => setMenuOpen(true),
    };
  }, [settings, menuOpen]);

  const columns = list(settings?.footer?.columns).map((c) => ({ title: c.title, links: list(c.links).map((l) => ({ label: l.label, href: clean(l.href), external: /^https?:/.test(clean(l.href)) })) }));
  const avatar = img(settings?.avatar);

  return (
    <ChromeContext.Provider value={chrome}>
      <MotionProvider revealMode="scrub">
        <ToastProvider>
          <PageRails />
          <ScrollEdges />
          <Header items={NAV} cta={chrome.cta} homeHref="/" currentHref={current} yieldToDock onMenu={chrome.openMenu} />
          <MenuDrawer
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            links={[{ label: 'Accueil', href: '/' }, ...NAV, { label: 'Contact', href: '/contact' }]}
            currentHref={pathname === '/' ? '/' : current}
            availability={chrome.availability}
            cta={chrome.cta}
            email={chrome.email}
            socials={chrome.socials}
            clock={{ timeZone: chrome.timeZone, places: CITY_PLACES }}
          />
          <main className="site-main">{children}</main>
          <Footer
            profile={{ name: chrome.name, role: chrome.disciplines.length ? chrome.disciplines : (settings?.role ?? 'Designer produit'), avatarSrc: avatar?.src, link: { label: 'À propos de moi', href: '/a-propos' } }}
            availability={chrome.availability}
            title={
              <>
                Parlons<em>-en.</em>
              </>
            }
            description={settings?.footer?.description ?? 'Un produit à clarifier ou une marque à faire exister ? Écrivez-moi, réponse sous 48 h ouvrées.'}
            email={chrome.email}
            cta={{ label: 'Écrire un e-mail', href: `mailto:${chrome.email}`, ring: 'Écrire un e-mail' }}
            columns={columns.length ? columns : FOOTER_COLUMNS}
            copyright={`© ${chrome.name}`}
            backToTop
            logoSlot
          />
        </ToastProvider>
      </MotionProvider>
    </ChromeContext.Provider>
  );
}
