// Import de départ du dataset Sanity : le contenu d'exemple des pages du design system (textes du site Framer, projets
// fictifs, visuels abstraits), pour que le studio ne soit pas vide et que les pages se voient tout de suite.
// À remplacer au fil de l'eau par le vrai contenu, dans le studio.
//
//   node scripts/seed/build-seed.mjs        → écrit sanity/seed/data.ndjson (les images sont dans sanity/seed/images)
//   npm run seed                            → importe le dossier dans le dataset (voir README)
import { writeFileSync } from 'node:fs';

const fr = (text) => ({ _type: 'localeString', fr: text });
const frText = (text) => ({ _type: 'localeText', fr: text });
let keyCount = 0;
const key = () => `k${(keyCount++).toString(36).padStart(4, '0')}`;
const keyed = (items) => items.map((item) => ({ _key: key(), ...item }));
const ref = (id) => ({ _type: 'reference', _ref: id, _key: key() });
const image = (name, alt = '') => ({ _type: 'figure', _sanityAsset: `image@file://./images/${name}.svg`, ...(alt ? { alt: fr(alt) } : {}) });

/** Texte riche : un paragraphe par chaîne ; « ## » en tête fait un intertitre. */
const blocks = (...paragraphs) => ({
  _type: 'localeBlocks',
  fr: paragraphs.map((p) => {
    const h3 = p.startsWith('## ');
    return { _type: 'block', _key: key(), style: h3 ? 'h3' : 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text: h3 ? p.slice(3) : p, marks: [] }] };
  }),
});

const media = (name, ratio = '16 / 9', extra = {}) => ({ _type: 'projectMedia', _key: key(), kind: 'image', image: image(name), ratio, framed: false, scrollZoom: false, ...extra });

// ---------- Catégories ----------
const CATEGORIES = [
  ['fintech', 'Fintech', 'accent'],
  ['sante', 'Santé', 'tertiary'],
  ['bien-etre', 'Bien-être', 'secondary'],
  ['e-commerce', 'E-commerce', 'tertiary'],
  ['productivite', 'Productivité', 'secondary'],
  ['medias', 'Médias', 'secondary'],
  ['application-mobile', 'Application mobile'],
  ['web', 'Web'],
  ['brand', 'Brand'],
  ['recherche', 'Recherche'],
  ['motion', 'Motion'],
  ['design-system', 'Design system'],
  ['illustration', 'Illustration'],
].map(([slug, title, swatch], i) => ({
  _id: `category-${slug}`,
  _type: 'category',
  title: fr(title),
  slug: { _type: 'slug', current: slug },
  ...(swatch ? { swatch } : {}),
  order: i + 1,
}));
const cat = (...slugs) => slugs.map((s) => ref(`category-${s}`));

// ---------- Témoignages ----------
const TESTIMONIALS = [
  ['nimbus', 'Fabien a transformé un parcours que personne ne comprenait en trois écrans évidents. Les appels au support ont fondu.', 'Claire Martin', 'Directrice produit', 'Nimbus'],
  ['arc', 'Il pose les bonnes questions avant de dessiner. On a gagné des semaines de développement.', 'Thomas Leroy', 'CTO', 'Arc Health'],
  ['cobalt', 'Notre design system est enfin utilisé par toute l’équipe, designers et développeurs. Et il tient.', 'Inès Haddad', 'Lead design', 'Cobalt'],
  ['loop', 'Un regard exigeant, une vraie écoute, et des détails soignés jusque dans les états d’erreur.', 'Julien Morel', 'Fondateur', 'Loop'],
].map(([id, quote, name, role, company], i) => ({ _id: `testimonial-${id}`, _type: 'testimonial', quote: frText(quote), name, role: fr(role), company, order: i + 1 }));

// ---------- Projets ----------
const card = (id, title, client, year, cover, categories, order, extra = {}) => ({
  _id: `project-${id}`,
  _type: 'project',
  title: fr(title),
  slug: { _type: 'slug', current: id },
  client,
  year,
  categories: cat(...categories),
  cover: image(cover, title),
  coverRatio: '4 / 3',
  order,
  ...extra,
});

const PROJECTS = [
  card('nimbus', 'Nimbus — Application bancaire', 'Nimbus', '2025', 'nimbus', ['fintech', 'application-mobile', 'brand'], 1, {
    featured: true,
    intro: frText('Une néobanque qui veut rendre la gestion d’un compte aussi simple qu’un message. Refonte de l’application, de la recherche au système de design.'),
    role: fr('Lead product designer, avec deux développeurs et une product manager.'),
    skills: ['Product design', 'Illustration', 'IA', 'Design system'].map((s) => ({ _key: key(), ...fr(s) })),
    tools: ['Figma', 'PostHog', 'Claude'],
    meta: keyed([{ _type: 'metaItem', label: fr('Durée'), value: fr('6 mois') }]),
    figures: keyed([
      { _type: 'keyFigure', value: '102', label: fr('Écrans conçus') },
      { _type: 'keyFigure', value: '45', label: fr('Composants') },
      { _type: 'keyFigure', value: '28', label: fr('Entretiens') },
      { _type: 'keyFigure', value: 'x10', label: fr('Utilisateurs actifs') },
    ]),
    chapters: keyed([
      { _type: 'chapter', label: fr('Contexte'), title: fr('Le produit, son public, son ambition.'), body: blocks('Nimbus s’adresse aux 25-35 ans qui gèrent leur argent depuis leur téléphone. L’application existante empilait les fonctions sans hiérarchie.'), media: [media('arc')] },
      { _type: 'chapter', label: fr('Product design'), title: fr('Définir le périmètre de l’expérience.'), body: blocks('Trois parcours prioritaires, un système de navigation à quatre onglets et une bibliothèque de composants partagée avec l’équipe de développement.'), media: [media('loop', '4 / 3', { framed: true }), media('kindred', '4 / 3', { framed: true })] },
      { _type: 'chapter', label: fr('Problème'), title: fr('Comprendre ce qui bloque.'), body: blocks('Douze entretiens et six mois de tickets de support analysés.', '## Ce que disent les utilisateurs', 'Les virements et le suivi des dépenses concentraient la moitié des demandes d’aide.') },
      { _type: 'chapter', label: fr('Design system'), title: fr('Une bibliothèque partagée avec le code.'), body: blocks('Quarante-cinq composants, des tokens partagés entre Figma et le code, et une documentation que l’équipe consulte vraiment.'), media: [media('sundial', '16 / 9', { scrollZoom: true })] },
      { _type: 'chapter', label: fr('Résultats'), title: fr('Ce qui a changé pour les utilisateurs.'), body: blocks('Dix fois plus d’utilisateurs actifs en un an, et deux fois moins de tickets de support sur les virements.'), figures: keyed([{ _type: 'keyFigure', value: '−50 %', label: fr('Tickets sur les virements') }, { _type: 'keyFigure', value: '4,8/5', label: fr('Note sur les stores') }]) },
    ]),
    testimonial: { _type: 'reference', _ref: 'testimonial-nimbus' },
  }),
  card('arc-health', 'Arc Health — Portail patient', 'Arc Health', '2024', 'arc', ['sante', 'web', 'recherche'], 2, {
    featured: true,
    intro: frText('Un portail où les patients retrouvent leurs rendez-vous, leurs résultats et leurs documents, sans appeler le secrétariat.'),
    role: fr('Product designer, de la recherche aux maquettes.'),
    chapters: keyed([{ _type: 'chapter', label: fr('Contexte'), title: fr('Un portail que les patients ouvrent vraiment.'), body: blocks('Étude de cas à rédiger.'), media: [media('arc')] }]),
    testimonial: { _type: 'reference', _ref: 'testimonial-arc' },
  }),
  card('loop', 'Loop — Suivi des habitudes', 'Loop', '2024', 'loop', ['bien-etre', 'application-mobile', 'motion'], 3, {
    featured: true,
    intro: frText('Suivre ses habitudes sans culpabiliser : une application douce, animée avec intention.'),
    chapters: keyed([{ _type: 'chapter', label: fr('Contexte'), title: fr('Encourager plutôt que juger.'), body: blocks('Étude de cas à rédiger.'), media: [media('loop')] }]),
    testimonial: { _type: 'reference', _ref: 'testimonial-loop' },
  }),
  card('kindred', 'Kindred — Place de marché', 'Projet personnel', '2024', 'kindred', ['e-commerce', 'design-system', 'brand'], 4, {
    chapters: keyed([{ _type: 'chapter', label: fr('Contexte'), title: fr('Une place de marché pour les créateurs indépendants.'), body: blocks('Étude de cas à rédiger.'), media: [media('kindred')] }]),
  }),
  card('sundial', 'Sundial — Agenda', 'Projet personnel', '2024', 'sundial', ['productivite', 'web'], 5, {
    chapters: keyed([{ _type: 'chapter', label: fr('Contexte'), title: fr('Un agenda qui respire.'), body: blocks('Étude de cas à rédiger.'), media: [media('sundial')] }]),
  }),
  card('fable', 'Fable — Application de lecture', 'Projet personnel', '2023', 'fable', ['medias', 'application-mobile', 'illustration'], 6, {
    chapters: keyed([{ _type: 'chapter', label: fr('Contexte'), title: fr('Lire sans distraction.'), body: blocks('Étude de cas à rédiger.'), media: [media('fable')] }]),
  }),
];

// ---------- Services ----------
const SERVICES = [
  ['design-produit', 'Design produit', 'Rendre les produits complexes simples à utiliser. Je relie les besoins des utilisateurs, les objectifs métier et les détails qui font la qualité d’une interface.', ['Exploration', 'Parcours utilisateurs', 'UX / UI'], 'cursor-click', 'nimbus'],
  ['design-systems', 'Systèmes de design', 'Donner un langage cohérent à votre produit. Des composants réutilisables et des règles claires pour aider les équipes à concevoir avec confiance.', ['Composants', 'Variables', 'Documentation'], 'stack', 'kindred'],
  ['web', 'Web et interactions', 'Transformer une idée forte en une expérience numérique singulière. Des sites soignés, des prototypes et des animations au service de l’usage.', ['Direction artistique', 'Framer', 'Prototypage'], 'sparkle', 'sundial'],
].map(([id, title, description, details, icon, preview], i) => ({
  _id: `service-${id}`,
  _type: 'service',
  title: fr(title),
  description: frText(description),
  details: details.map((d) => ({ _key: key(), ...fr(d) })),
  icon,
  preview: image(preview, title),
  order: i + 1,
}));

// ---------- Lab ----------
const LAB = [
  ['aurora', 'Aurora — Identité animée', 'Animation', '2025', 'lime', '1 / 1'],
  ['fable', 'Fable — Couvertures illustrées', 'Illustration', '2023', 'pink', '3 / 4'],
  ['sundial', 'Sundial — Exploration UI', 'Exploration UI', '2024', 'blue', '4 / 3'],
].map(([cover, title, kind, year, tone, ratio], i) => ({
  _id: `lab-${cover}`,
  _type: 'lab',
  title: fr(title),
  media: { _type: 'projectMedia', kind: 'image', image: image(cover, title), ratio, framed: false, scrollZoom: false },
  kind: fr(kind),
  year,
  tone,
  order: i + 1,
}));

// ---------- Réglages ----------
const SETTINGS = {
  _id: 'settings',
  _type: 'settings',
  name: 'Fabien Michaud',
  role: fr('Designer produit et marque'),
  disciplines: ['Design produit', 'Brand design', 'Motion design'].map((d) => ({ _key: key(), ...fr(d) })),
  city: 'Paris',
  timeZone: 'Europe/Paris',
  email: 'hello@fabienmichaud.com',
  cta: { _type: 'link', label: fr('Parlons-en'), href: '/contact' },
  availabilityStatus: 'available',
  availabilityLabel: fr('Disponible'),
  availabilityDetail: fr('dès janvier'),
  heroTitle: fr('Des produits'),
  heroWords: ['qui font sens.', 'qui tiennent.', 'qui marquent.', 'qui durent.'].map((w) => ({ _key: key(), ...fr(w) })),
  heroIntro: frText('Je transforme les problèmes complexes en interfaces simples et agréables à utiliser, de la première esquisse au produit final.'),
  featuredProjects: ['nimbus', 'arc-health', 'loop'].map((id) => ref(`project-${id}`)),
  skillRows: keyed([
    { _type: 'skillRow', items: keyed([{ _type: 'skill', label: fr('Design produit'), tone: 'lime' }, { _type: 'skill', label: fr('Recherche') }, { _type: 'skill', label: fr('Design systems'), tone: 'pink' }, { _type: 'skill', label: fr('Prototypage') }]) },
    { _type: 'skillRow', items: keyed([{ _type: 'skill', label: fr('Direction artistique') }, { _type: 'skill', label: fr('Interaction'), tone: 'blue' }, { _type: 'skill', label: fr('Illustration') }, { _type: 'skill', label: fr('Animation'), tone: 'paper' }]) },
  ]),
  manifesto: keyed(
    [
      ['Comprendre avant de dessiner.', 'Les meilleures interfaces commencent par les bonnes questions, pas par des pixels.'],
      ['Le simple demande du travail.', 'Retirer, regrouper, nommer : la simplicité se construit.'],
      ['Les détails font le produit.', 'Un état vide, une erreur, une attente : c’est là que la confiance se gagne.'],
      ['Un système plutôt qu’une collection.', 'Des règles partagées libèrent les équipes au lieu de les brider.'],
      ['Livrer, mesurer, recommencer.', 'Une idée ne vaut que confrontée aux vrais usages.'],
    ].map(([title, description]) => ({ _type: 'belief', title: fr(title), description: frText(description) })),
  ),
  footerDescription: frText('Une idée de produit ou un problème complexe ? Donnons-lui une forme claire, utile et agréable à utiliser.'),
};

const docs = [SETTINGS, ...CATEGORIES, ...TESTIMONIALS, ...PROJECTS, ...SERVICES, ...LAB];
writeFileSync(new URL('../../sanity/seed/data.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`✓ sanity/seed/data.ndjson : ${docs.length} documents`);
