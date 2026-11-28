import { chapter, keyFigure, link, seo, socialLink } from './objects/blocks';
import { localeBlocks, localeString, localeText } from './objects/locale';
import { figure, projectMedia, video } from './objects/media';
import { category, faq, lab, service, testimonial } from './documents/collections';
import { project } from './documents/project';
import { settings } from './documents/settings';

export const schemaTypes = [
  // Objets
  localeString,
  localeText,
  localeBlocks,
  figure,
  video,
  projectMedia,
  link,
  socialLink,
  keyFigure,
  chapter,
  seo,
  // Documents
  settings,
  project,
  category,
  lab,
  service,
  testimonial,
  faq,
];

/** Documents uniques : pas de création ni de duplication depuis le studio. */
export const SINGLETONS = new Set(['settings']);
