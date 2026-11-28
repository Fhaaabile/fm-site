import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { client } from '@/sanity/client';
import { readToken } from '@/sanity/env';

/** Appelée par l'outil Aperçu du studio : vérifie le secret qu'il envoie, puis ouvre le mode brouillon. */
export const { GET } = defineEnableDraftMode({ client: client.withConfig({ token: readToken ?? '' }) });
