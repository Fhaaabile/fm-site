// Médias : une image porte toujours son texte alternatif (accessibilité), une vidéo son libellé (lu par les
// lecteurs d'écran à la place du contenu animé) et une affiche.
import { ImageIcon } from '@sanity/icons/Image';
import { PlayIcon } from '@sanity/icons/Play';
import { defineField, defineType } from 'sanity';
import { RATIOS } from '../../lib/options';

export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      description: "Ce que l'image montre, pour qui ne la voit pas. Laisser vide en français seulement si elle est décorative.",
      type: 'localeString',
    }),
  ],
});

export const video = defineType({
  name: 'video',
  title: 'Vidéo',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({ name: 'file', title: 'Fichier', description: 'MP4 (H.264), muet, idéalement moins de 8 Mo.', type: 'file', options: { accept: 'video/mp4,video/webm' }, validation: (r) => r.required() }),
    defineField({ name: 'poster', title: 'Affiche', description: 'Image montrée avant la lecture et en mouvement réduit.', type: 'figure', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Libellé', description: 'Ce que la vidéo montre, en une phrase.', type: 'localeString', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label.fr', media: 'poster' } },
});

/** Média d'une étude de cas (ProjectMedia) : image ou vidéo, légende, proportion, cadre. */
export const projectMedia = defineType({
  name: 'projectMedia',
  title: 'Média',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: { list: [{ title: 'Image', value: 'image' }, { title: 'Vidéo', value: 'video' }], layout: 'radio', direction: 'horizontal' },
      initialValue: 'image',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'image', title: 'Image', type: 'figure', hidden: ({ parent }) => parent?.kind !== 'image' }),
    defineField({ name: 'video', title: 'Vidéo', type: 'video', hidden: ({ parent }) => parent?.kind !== 'video' }),
    defineField({ name: 'caption', title: 'Légende', type: 'localeString' }),
    defineField({ name: 'ratio', title: 'Proportion', type: 'string', options: { list: RATIOS }, initialValue: '16 / 9' }),
    defineField({ name: 'framed', title: 'Cadre', description: 'Pose le média sur une surface avec un filet (captures d’écran).', type: 'boolean', initialValue: false }),
    defineField({ name: 'scrollZoom', title: 'Zoom au défilement', description: 'L’image dézoome doucement quand on la croise.', type: 'boolean', initialValue: false }),
  ],
  validation: (rule) =>
    rule.custom((value: { kind?: string; image?: { asset?: unknown; alt?: { fr?: string } }; video?: unknown } | undefined) => {
      if (!value) return true;
      if (value.kind === 'image' && !value.image?.asset) return 'Ajoute une image.';
      if (value.kind === 'image' && !value.image?.alt?.fr) return 'Le texte alternatif de l’image est obligatoire dans une étude de cas.';
      if (value.kind === 'video' && !value.video) return 'Ajoute une vidéo.';
      return true;
    }),
  preview: {
    select: { kind: 'kind', image: 'image', poster: 'video.poster', caption: 'caption.fr', alt: 'image.alt.fr', label: 'video.label.fr' },
    prepare: ({ kind, image, poster, caption, alt, label }) => ({
      title: caption || (kind === 'video' ? label : alt) || 'Média',
      subtitle: kind === 'video' ? 'Vidéo' : 'Image',
      media: kind === 'video' ? poster : image,
    }),
  },
});
