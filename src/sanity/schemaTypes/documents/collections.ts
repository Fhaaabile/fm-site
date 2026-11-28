// Collections courtes : catégories, Lab, services, témoignages, FAQ.
import { BulbOutlineIcon } from '@sanity/icons/BulbOutline';
import { CommentIcon } from '@sanity/icons/Comment';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { TagIcon } from '@sanity/icons/Tag';
import { WrenchIcon } from '@sanity/icons/Wrench';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { ICONS, SWATCHES, TONES } from '../../lib/options';

const order = defineField({ name: 'order', title: 'Ordre', description: 'Du plus petit au plus grand.', type: 'number' });
const byOrder = [{ title: 'Ordre', name: 'order', by: [{ field: 'order', direction: 'asc' as const }] }];

/** Catégorie de projet (ProjectCategory) : libellé et pastille de couleur. */
export const category = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Libellé', description: 'Secteur · support : « Fintech · Application mobile ».', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Identifiant', type: 'slug', options: { source: 'title.fr' }, validation: (r) => r.required() }),
    defineField({ name: 'swatch', title: 'Pastille', type: 'string', options: { list: SWATCHES, layout: 'radio', direction: 'horizontal' } }),
    order,
  ],
  orderings: byOrder,
  preview: { select: { title: 'title.fr', subtitle: 'swatch' } },
});

/** Pièce du Lab (Masonry de cartes) : exploration, illustration, animation. */
export const lab = defineType({
  name: 'lab',
  title: 'Lab',
  type: 'document',
  icon: BulbOutlineIcon,
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'media', title: 'Média', type: 'projectMedia', validation: (r) => r.required() }),
    defineField({ name: 'kind', title: 'Type', type: 'localeString', description: 'Illustration, Animation, Exploration UI…' }),
    defineField({ name: 'year', title: 'Année', type: 'string', validation: (r) => r.regex(/^\d{4}$/, { name: 'année' }) }),
    defineField({ name: 'tone', title: 'Couleur de la carte', type: 'string', options: { list: TONES } }),
    defineField({ name: 'url', title: 'Lien', description: 'Dribbble, Behance, prototype…', type: 'url' }),
    order,
  ],
  orderings: byOrder,
  preview: {
    select: { title: 'title.fr', kind: 'kind.fr', year: 'year', image: 'media.image', poster: 'media.video.poster' },
    prepare: ({ title, kind, year, image, poster }) => ({ title, subtitle: [kind, year].filter(Boolean).join(' · '), media: image ?? poster }),
  },
});

/** Service (ServiceRow) : le numéro vient de l'ordre. */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localeText', validation: (r) => r.required() }),
    defineField({ name: 'details', title: 'Livrables', type: 'array', of: [defineArrayMember({ type: 'localeString' })], validation: (r) => r.max(6) }),
    defineField({ name: 'icon', title: 'Icône', description: 'Icône animée au survol de la ligne.', type: 'string', options: { list: ICONS } }),
    defineField({ name: 'preview', title: 'Aperçu', description: 'Image qui suit le pointeur au survol.', type: 'figure' }),
    defineField({ name: 'link', title: 'Lien', type: 'link' }),
    order,
  ],
  orderings: byOrder,
  preview: { select: { title: 'title.fr', subtitle: 'description.fr', media: 'preview' } },
});

/** Témoignage (Testimonials). */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({ name: 'quote', title: 'Citation', type: 'localeText', validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Fonction', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'company', title: 'Entreprise ou projet', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'avatar', title: 'Photo', description: 'À défaut, les initiales.', type: 'figure' }),
    order,
  ],
  orderings: byOrder,
  preview: { select: { title: 'name', subtitle: 'company', media: 'avatar' } },
});

/** Question fréquente (Accordion). */
export const faq = defineType({
  name: 'faq',
  title: 'Question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'answer', title: 'Réponse', type: 'localeBlocks', validation: (r) => r.required() }),
    defineField({
      name: 'topic',
      title: 'Thème',
      type: 'string',
      options: {
        list: [
          { title: 'Collaboration', value: 'collaboration' },
          { title: 'Méthode', value: 'process' },
          { title: 'Tarifs et délais', value: 'pricing' },
          { title: 'Assistant', value: 'assistant' },
        ],
      },
    }),
    order,
  ],
  orderings: byOrder,
  preview: { select: { title: 'question.fr', subtitle: 'topic' } },
});
