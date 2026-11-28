// Projet : la carte (ProjectCard, ProjectIndex) et l'étude de cas (ProjectHero, ChapterNav, ProjectChapter,
// ProjectMedia, KeyFigures, ProjectPagination) viennent du même document.
import { CaseIcon } from '@sanity/icons/Case';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { RATIOS } from '../../lib/options';

export const project = defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  icon: CaseIcon,
  groups: [
    { name: 'card', title: 'Carte', default: true },
    { name: 'hero', title: 'En-tête' },
    { name: 'case', title: 'Étude de cas' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Titre', description: 'Nom du projet, éventuellement suivi de sa promesse : « Nimbus — Application bancaire ».', type: 'localeString', group: 'card', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Adresse', type: 'slug', group: 'card', options: { source: 'title.fr', maxLength: 64 }, validation: (r) => r.required() }),
    defineField({ name: 'client', title: 'Client', type: 'string', group: 'card' }),
    defineField({ name: 'clientLogo', title: 'Logo du client', description: 'SVG monochrome de préférence : il prend la couleur du texte.', type: 'image', group: 'card', options: { accept: 'image/svg+xml,image/png' } }),
    defineField({ name: 'year', title: 'Année', type: 'string', group: 'card', validation: (r) => r.regex(/^\d{4}$/, { name: 'année' }) }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      description: 'Une à trois ; elles servent aussi de filtres dans la liste des projets.',
      type: 'array',
      group: 'card',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      validation: (r) => r.max(3).unique(),
    }),
    defineField({ name: 'cover', title: 'Couverture', type: 'figure', group: 'card', validation: (r) => r.required() }),
    defineField({ name: 'coverRatio', title: 'Proportion de la couverture', type: 'string', group: 'card', options: { list: RATIOS }, initialValue: '4 / 3' }),
    defineField({ name: 'featured', title: 'À la une', description: 'Affiché sur l’accueil et dans le menu latéral (le plus récent à la une y figure).', type: 'boolean', group: 'card', initialValue: false }),
    defineField({ name: 'order', title: 'Ordre', description: 'Du plus petit au plus grand ; à défaut, l’année.', type: 'number', group: 'card' }),

    defineField({ name: 'intro', title: 'Introduction', type: 'localeText', group: 'hero' }),
    defineField({ name: 'role', title: 'Mon rôle', type: 'localeString', group: 'hero' }),
    defineField({ name: 'skills', title: 'Compétences mobilisées', type: 'array', group: 'hero', of: [defineArrayMember({ type: 'localeString' })] }),
    defineField({ name: 'tools', title: 'Outils', type: 'array', group: 'hero', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({
      name: 'meta',
      title: 'Repères',
      description: 'Lignes courtes sous le titre : Durée, Équipe, Plateformes…',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metaItem',
          fields: [
            defineField({ name: 'label', title: 'Intitulé', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'value', title: 'Valeur', type: 'localeString', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'label.fr', subtitle: 'value.fr' } },
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({ name: 'heroCover', title: 'Image de fond de l’en-tête', description: 'À défaut, la couverture.', type: 'figure', group: 'hero' }),
    defineField({ name: 'thumbnail', title: 'Vignette « Voir en live »', description: 'Capture du produit en ligne ; elle s’incline en 3D au survol.', type: 'figure', group: 'hero' }),
    defineField({ name: 'liveLink', title: 'Lien en ligne', type: 'link', group: 'hero' }),

    defineField({ name: 'figures', title: 'Chiffres clés', description: 'Le bandeau qui suit l’en-tête. Deux à quatre.', type: 'array', group: 'case', of: [defineArrayMember({ type: 'keyFigure' })], validation: (r) => r.max(4) }),
    defineField({ name: 'chapters', title: 'Chapitres', type: 'array', group: 'case', of: [defineArrayMember({ type: 'chapter' })] }),
    defineField({ name: 'testimonial', title: 'Témoignage', type: 'reference', group: 'case', to: [{ type: 'testimonial' }] }),

    defineField({ name: 'seo', title: 'Référencement', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Ordre', name: 'order', by: [{ field: 'order', direction: 'asc' }, { field: 'year', direction: 'desc' }] },
    { title: 'Année, récent d’abord', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.fr', client: 'client', year: 'year', media: 'cover', featured: 'featured' },
    prepare: ({ title, client, year, media, featured }) => ({
      title,
      subtitle: [featured ? 'À la une' : null, client, year].filter(Boolean).join(' · '),
      media,
    }),
  },
});
