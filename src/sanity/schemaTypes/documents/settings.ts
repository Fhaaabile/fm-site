// Réglages : document unique (id « settings ») pour tout ce qui est partagé par les pages : identité,
// disponibilité, contact, accueil, pied de page, référencement par défaut.
import { CogIcon } from '@sanity/icons/Cog';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { AVAILABILITY, TONES } from '../../lib/options';

export const SETTINGS_ID = 'settings';

export const settings = defineType({
  name: 'settings',
  title: 'Réglages',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identité', default: true },
    { name: 'availability', title: 'Disponibilité' },
    { name: 'home', title: 'Accueil' },
    { name: 'footer', title: 'Pied de page' },
    { name: 'seo', title: 'Référencement' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Nom', type: 'string', group: 'identity', initialValue: 'Fabien Michaud', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Métier', type: 'localeString', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'avatar', title: 'Portrait', type: 'figure', group: 'identity' }),
    defineField({ name: 'disciplines', title: 'Disciplines', description: 'Barre sous le header : trois intitulés courts.', type: 'array', group: 'identity', of: [defineArrayMember({ type: 'localeString' })], validation: (r) => r.max(4) }),
    defineField({ name: 'city', title: 'Ville', type: 'string', group: 'identity', initialValue: 'Paris' }),
    defineField({ name: 'timeZone', title: 'Fuseau horaire', description: 'Pour l’horloge (format IANA).', type: 'string', group: 'identity', initialValue: 'Europe/Paris' }),
    defineField({ name: 'email', title: 'Adresse de contact', type: 'string', group: 'identity', validation: (r) => r.required().email() }),
    defineField({ name: 'socials', title: 'Réseaux', type: 'array', group: 'identity', of: [defineArrayMember({ type: 'socialLink' })] }),
    defineField({ name: 'cta', title: 'Appel à l’action', description: 'Bouton du header, du Dock et du menu : « Parlons-en ».', type: 'link', group: 'identity' }),

    defineField({ name: 'availabilityStatus', title: 'Statut', type: 'string', group: 'availability', options: { list: AVAILABILITY, layout: 'radio' }, initialValue: 'available' }),
    defineField({ name: 'availabilityLabel', title: 'Libellé', type: 'localeString', group: 'availability' }),
    defineField({ name: 'availabilityDetail', title: 'Précision', description: '« dès janvier », « 2 jours par semaine ».', type: 'localeString', group: 'availability' }),

    defineField({ name: 'heroTitle', title: 'Titre d’accueil', type: 'localeString', group: 'home' }),
    defineField({ name: 'heroWords', title: 'Mots qui roulent', description: 'Les mots qui défilent dans le titre (TextRotator).', type: 'array', group: 'home', of: [defineArrayMember({ type: 'localeString' })] }),
    defineField({ name: 'heroIntro', title: 'Introduction', type: 'localeText', group: 'home' }),
    defineField({ name: 'featuredProjects', title: 'Projets de l’accueil', description: 'Dans l’ordre d’affichage. À défaut, les projets à la une.', type: 'array', group: 'home', of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })], validation: (r) => r.unique() }),
    defineField({
      name: 'skillRows',
      title: 'Bandeau de compétences',
      description: 'Une ou deux rangées qui défilent en sens inverse.',
      type: 'array',
      group: 'home',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'skillRow',
          title: 'Rangée',
          fields: [
            defineField({
              name: 'items',
              title: 'Compétences',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'skill',
                  fields: [
                    defineField({ name: 'label', title: 'Libellé', type: 'localeString', validation: (r) => r.required() }),
                    defineField({ name: 'tone', title: 'Couleur', description: 'Une pastille de couleur toutes les trois ou quatre suffit.', type: 'string', options: { list: TONES } }),
                  ],
                  preview: { select: { title: 'label.fr', subtitle: 'tone' } },
                }),
              ],
            }),
          ],
          preview: { select: { a: 'items.0.label.fr', b: 'items.1.label.fr' }, prepare: ({ a, b }) => ({ title: [a, b].filter(Boolean).join(', ') + '…' }) },
        }),
      ],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'manifesto',
      title: 'Convictions',
      type: 'array',
      group: 'home',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'belief',
          fields: [
            defineField({ name: 'title', title: 'Conviction', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Explication', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.fr' } },
        }),
      ],
    }),
    defineField({
      name: 'clients',
      title: 'Logos clients',
      type: 'array',
      group: 'home',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'client',
          fields: [
            defineField({ name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', title: 'Logo', description: 'SVG monochrome.', type: 'image', options: { accept: 'image/svg+xml' }, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),

    defineField({ name: 'footerDescription', title: 'Phrase du pied de page', type: 'localeText', group: 'footer' }),
    defineField({
      name: 'footerColumns',
      title: 'Colonnes de liens',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({ name: 'title', title: 'Titre', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'links', title: 'Liens', type: 'array', of: [defineArrayMember({ type: 'link' })] }),
          ],
          preview: { select: { title: 'title.fr' } },
        }),
      ],
      validation: (r) => r.max(4),
    }),

    defineField({ name: 'seo', title: 'Référencement par défaut', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Réglages du site' }) },
});
