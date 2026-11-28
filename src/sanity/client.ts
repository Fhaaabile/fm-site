import { createClient } from 'next-sanity';
import { apiHost, apiVersion, dataset, projectId } from './env';

/**
 * Client de lecture. En mode brouillon (aperçu du studio), les textes portent des repères invisibles (« stega ») qui
 * relient chaque mot à son champ : un clic dans l'aperçu ouvre le bon champ du studio, servi par le site à /studio.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  ...(apiHost ? { apiHost, useCdn: false } : {}),
  stega: { studioUrl: '/studio' },
});
