import { defineLive } from 'next-sanity/live';
import { client } from './client';
import { readToken } from './env';

/**
 * Lecture en direct (Live Content API) : une page publiée se met à jour dès qu'un document change, sans reconstruire le
 * site. Le jeton n'est partagé avec le navigateur qu'en mode brouillon, ouvert depuis l'aperçu du studio.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken ?? false,
  browserToken: readToken ?? false,
});

/**
 * Lit une requête et rend son résultat typé par `npm run typegen` (les requêtes sont assemblées par morceaux, TypeScript
 * ne peut pas retrouver leur type seul). `stega: false` pour les métadonnées, qui n'ont pas de repères à afficher.
 */
export async function load<T>(query: string, params: Record<string, unknown>, options: { stega?: boolean } = {}): Promise<T> {
  const { data } = await sanityFetch({ query, params, ...options });
  return data as T;
}
