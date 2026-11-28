// Petits objets réutilisés par les documents : liens, réseaux, chiffres clés, chapitres, SEO.
import { BarChartIcon } from '@sanity/icons/BarChart';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { LinkIcon } from '@sanity/icons/Link';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { NETWORKS } from '../../lib/options';

export const link = defineType({
  name: 'link',
  title: 'Lien',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({ name: 'label', title: 'Libellé', type: 'localeString', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Adresse',
      description: 'Adresse complète (https://…), ancre (#contact), chemin (/projets) ou mailto:.',
      type: 'string',
      validation: (r) => r.required().regex(/^(https?:\/\/|mailto:|\/|#)/, { name: 'adresse' }),
    }),
  ],
  preview: { select: { title: 'label.fr', subtitle: 'href' } },
});

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Réseau',
  type: 'object',
  fields: [
    defineField({ name: 'network', title: 'Réseau', type: 'string', options: { list: NETWORKS }, validation: (r) => r.required() }),
    defineField({ name: 'url', title: 'Adresse du profil', type: 'url', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'network', subtitle: 'url' } },
});

/** Chiffre clé (KeyFigures, Stat). La valeur reste une chaîne : « +38 % », « 4,8/5 », « 12 k ». */
export const keyFigure = defineType({
  name: 'keyFigure',
  title: 'Chiffre clé',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({ name: 'value', title: 'Valeur', description: 'Telle qu’affichée : +38 %, 4,8/5, 12 k. Les chiffres comptent jusqu’à leur valeur à l’apparition.', type: 'string', validation: (r) => r.required().max(10) }),
    defineField({ name: 'label', title: 'Libellé', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Précision', type: 'localeText' }),
    defineField({ name: 'media', title: 'Image', description: 'Pour la variante étirable : l’image se dévoile au survol.', type: 'figure' }),
  ],
  preview: { select: { title: 'value', subtitle: 'label.fr', media: 'media' } },
});

/** Chapitre d'une étude de cas (ProjectChapter + ChapterNav). */
export const chapter = defineType({
  name: 'chapter',
  title: 'Chapitre',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'label', title: 'Intitulé court', description: 'Repris dans le sommaire ancré : Contexte, Recherche, Solution…', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Titre', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Texte', type: 'localeBlocks' }),
    defineField({ name: 'media', title: 'Médias', type: 'array', of: [defineArrayMember({ type: 'projectMedia' })] }),
    defineField({ name: 'figures', title: 'Chiffres clés', description: 'Facultatif : un bandeau de chiffres à la fin du chapitre.', type: 'array', of: [defineArrayMember({ type: 'keyFigure' })], validation: (r) => r.max(4) }),
  ],
  preview: {
    select: { label: 'label.fr', title: 'title.fr', media: 'media.0.image' },
    prepare: ({ label, title, media }) => ({ title: label || 'Chapitre', subtitle: title, media }),
  },
});

export const seo = defineType({
  name: 'seo',
  title: 'Référencement',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', title: 'Titre de la page', description: 'Moins de 60 caractères. À défaut, le titre du document.', type: 'localeString' }),
    defineField({ name: 'description', title: 'Description', description: 'Moins de 160 caractères.', type: 'localeText' }),
    defineField({ name: 'image', title: 'Image de partage', description: '1200 × 630.', type: 'image' }),
    defineField({ name: 'noIndex', title: 'Masquer des moteurs de recherche', type: 'boolean', initialValue: false }),
  ],
});
