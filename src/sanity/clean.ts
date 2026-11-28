import { stegaClean } from 'next-sanity';
import type { HomeQueryResult, SettingsQueryResult } from './sanity.types';

/**
 * En mode brouillon, les textes portent des repères invisibles (stega). Les valeurs que les composants comparent
 * (adresses, réseaux, tons, icônes, proportions, chiffres qui comptent) doivent en être lavées ; les textes affichés,
 * eux, les gardent pour que le clic dans l'aperçu ouvre le bon champ.
 */
export function clean<T>(value: T): T {
  return stegaClean(value) as T;
}

/** Retire les `null` d'une liste et ses éléments vides. */
export function list<T>(items: (T | null | undefined)[] | null | undefined): T[] {
  return (items ?? []).filter((x): x is T => x != null);
}

/** Image Sanity → `{ src, alt }` des composants ; `undefined` sans fichier. */
export function img(image: { src: string | null; alt?: string | null } | null | undefined, fallbackAlt = '') {
  const src = clean(image?.src);
  return src ? { src, alt: image?.alt ?? fallbackAlt } : undefined;
}

/** Réglages du site, une fois le document `settings` trouvé. */
export type Settings = Extract<NonNullable<SettingsQueryResult>, { email: unknown }>;

export function isSettings(value: SettingsQueryResult): value is Settings {
  return value != null && 'email' in value;
}

/** Contenu de l'accueil, une fois le document `settings` trouvé. */
export type Home = Extract<NonNullable<HomeQueryResult>, { services: unknown }>;

export function isHome(value: HomeQueryResult): value is Home {
  return value != null && 'services' in value;
}
