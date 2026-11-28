// Listes fermées reprises des composants du design system : un choix fait dans le studio est toujours une
// valeur que le composant sait afficher. À tenir à jour avec les types cités en commentaire.
import { ANIMATED_ICON_NAMES } from '@fhaaabile/fm-design-system/data';

/** Langues du site. Le français est la langue de référence : il est obligatoire, l'anglais est conseillé. */
export const LANGUAGES = [
  { id: 'fr', title: 'Français' },
  { id: 'en', title: 'English' },
] as const;
export type Language = (typeof LANGUAGES)[number]['id'];
export const BASE_LANGUAGE: Language = 'fr';

/** `CardTone` (Card, SkillTicker, Statement). */
export const TONES = [
  { title: 'Citron', value: 'lime' },
  { title: 'Rose', value: 'pink' },
  { title: 'Bleu', value: 'blue' },
  { title: 'Papier', value: 'paper' },
  { title: 'Encre', value: 'ink' },
];

/** `ProjectCategory.swatch` (ProjectCard, ProjectHero, ProjectIndex). */
export const SWATCHES = [
  { title: 'Accent', value: 'accent' },
  { title: 'Secondaire', value: 'secondary' },
  { title: 'Tertiaire', value: 'tertiary' },
];

/** `AvailabilityStatus`. */
export const AVAILABILITY = [
  { title: 'Disponible', value: 'available' },
  { title: 'Disponibilité réduite', value: 'limited' },
  { title: 'Indisponible', value: 'unavailable' },
];

/** `SocialNetwork` (SocialLink). */
export const NETWORKS = [
  { title: 'LinkedIn', value: 'linkedin' },
  { title: 'Instagram', value: 'instagram' },
  { title: 'Dribbble', value: 'dribbble' },
  { title: 'Behance', value: 'behance' },
  { title: 'GitHub', value: 'github' },
];

/** Icônes animées disponibles (Icon `animate`, AnimatedIcon) : noms Phosphor en kebab-case. */
export const ICONS = ANIMATED_ICON_NAMES.filter((name) => !name.endsWith('-fill')).map((name) => ({ title: name, value: name }));

/** Proportions de médias proposées (ProjectMedia `ratio`, ProjectCard `coverRatio`). */
export const RATIOS = [
  { title: '16:9', value: '16 / 9' },
  { title: '16:10', value: '16 / 10' },
  { title: '4:3', value: '4 / 3' },
  { title: '1:1', value: '1 / 1' },
  { title: '3:4', value: '3 / 4' },
  { title: '9:16', value: '9 / 16' },
];
