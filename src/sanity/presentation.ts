import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

/** Où chaque document apparaît sur le site : l'outil Aperçu propose ces pages à côté du formulaire. */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: [
    { route: '/', filter: `_id == "settings"` },
    { route: '/projets/:slug', filter: `_type == "project" && slug.current == $slug` },
  ],
  locations: {
    settings: defineLocations({
      message: 'Réglages communs à toutes les pages.',
      locations: [
        { title: 'Accueil', href: '/' },
        { title: 'Projets', href: '/projets' },
      ],
    }),
    project: defineLocations({
      select: { title: 'title.fr', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          ...(doc?.slug ? [{ title: doc.title || 'Projet', href: `/projets/${doc.slug}` }] : []),
          { title: 'Projets', href: '/projets' },
          { title: 'Accueil', href: '/' },
        ],
      }),
    }),
    category: defineLocations({ locations: [{ title: 'Projets', href: '/projets' }] }),
    service: defineLocations({ locations: [{ title: 'Accueil', href: '/' }] }),
    testimonial: defineLocations({ locations: [{ title: 'Accueil', href: '/' }] }),
    lab: defineLocations({ locations: [{ title: 'Accueil', href: '/' }] }),
  },
};
