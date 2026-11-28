// Réglages Sanity (voir .env.example). L'identifiant du projet et le dataset ne sont pas secrets : ils ont une valeur
// par défaut, l'environnement peut les remplacer. Le jeton de lecture, lui, ne vit que dans l'environnement.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91cstvku';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2026-11-01';
/** Jeton Viewer : brouillons et aperçu en direct. Sans lui, le site ne montre que le contenu publié. */
export const readToken = process.env.SANITY_API_READ_TOKEN || undefined;
/** Hôte de l'API, seulement pour les essais hors ligne (serveur local qui rejoue l'import de départ). */
export const apiHost = process.env.SANITY_API_HOST || undefined;
