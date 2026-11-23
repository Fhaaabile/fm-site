import { createClient, type SanityClient } from '@sanity/client';
import { apiVersion, dataset, isSanityConfigured, projectId } from './env';

/** Client de lecture des contenus publiés (CDN). `null` tant que le projet Sanity n'est pas configuré. */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
  : null;

/** Lit une requête GROQ ; renvoie `fallback` si Sanity n'est pas encore branché. */
export async function fetchContent<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!client) return fallback;
  return client.fetch<T>(query, params, { next: { revalidate: 60 } });
}
