// Barre latérale du studio : les réglages d'abord (document unique), puis le contenu dans l'ordre des pages.
import { CogIcon } from '@sanity/icons/Cog';
import type { StructureResolver } from 'sanity/structure';
import { SETTINGS_ID } from './schemaTypes/documents/settings';

const ordered = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.documentTypeListItem(type).title(title).child(S.documentTypeList(type).title(title).defaultOrdering([{ field: 'order', direction: 'asc' }]));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem().title('Réglages du site').icon(CogIcon).id(SETTINGS_ID).child(S.document().schemaType('settings').documentId(SETTINGS_ID).title('Réglages du site')),
      S.divider(),
      ordered(S, 'project', 'Projets'),
      ordered(S, 'lab', 'Lab'),
      ordered(S, 'service', 'Services'),
      ordered(S, 'testimonial', 'Témoignages'),
      ordered(S, 'faq', 'Questions fréquentes'),
      S.divider(),
      ordered(S, 'category', 'Catégories de projets'),
    ]);
