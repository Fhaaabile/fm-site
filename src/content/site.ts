// Navigation et repli des réglages : ce que le site affiche tant qu'un réglage manque dans Sanity. Textes d'interface en
// français, vouvoiement quand on s'adresse au visiteur.

export const SITE = {
  name: 'Fabien Michaud',
  email: 'hello@fabienmichaud.com',
  promise: 'Des produits clairs, des marques qui se retiennent.',
  baseline: 'Du problème à la forme.',
};

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Projets', href: '/projets' },
  { label: 'Lab', href: '/lab' },
  { label: 'À propos', href: '/a-propos' },
];

export const CTA = { label: 'Parlons-en', href: '/contact' };

export const FOOTER_COLUMNS = [
  { title: 'Explorer', links: [...NAV, { label: 'Contact', href: '/contact' }] },
  { title: 'Contact', links: [{ label: SITE.email, href: `mailto:${SITE.email}` }] },
];
