// Champs bilingues (D-068) : un objet par type de texte, une entrée par langue. Ils remplacent les dictionnaires
// d'AutoTranslate : le site lit `field[locale] ?? field.fr`.
import { defineArrayMember, defineField, defineType } from 'sanity';
import { BASE_LANGUAGE, LANGUAGES } from '../../lib/options';

type Kind = 'string' | 'text' | 'blocks';

function localeFields(kind: Kind) {
  return LANGUAGES.map((lang) => {
    const base = lang.id === BASE_LANGUAGE;
    // Français obligatoire ; l'anglais manquant est signalé sans bloquer la publication.
    const message = base ? 'Le français est obligatoire.' : 'Traduction anglaise manquante.';
    if (kind === 'blocks') {
      return defineField({
        name: lang.id,
        title: lang.title,
        type: 'array',
        of: [
          defineArrayMember({
            type: 'block',
            // Le texte courant du site : paragraphes, un intertitre, des listes, emphase et liens. Le reste vient des composants.
            styles: [
              { title: 'Paragraphe', value: 'normal' },
              { title: 'Intertitre', value: 'h3' },
              { title: 'Citation', value: 'blockquote' },
            ],
            lists: [
              { title: 'Puces', value: 'bullet' },
              { title: 'Numérotée', value: 'number' },
            ],
            marks: {
              decorators: [
                { title: 'Gras', value: 'strong' },
                { title: 'Italique', value: 'em' },
              ],
              annotations: [
                defineArrayMember({
                  name: 'link',
                  title: 'Lien',
                  type: 'object',
                  fields: [defineField({ name: 'href', title: 'Adresse', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }) })],
                }),
              ],
            },
          }),
        ],
        validation: (rule) => (base ? rule.required().error(message) : rule.required().warning(message)),
      });
    }
    return defineField({ name: lang.id, title: lang.title, type: kind, rows: kind === 'text' ? 3 : undefined, validation: (rule) => (base ? rule.required().error(message) : rule.required().warning(message)) });
  });
}

const options = { collapsible: false, columns: 1 };

export const localeString = defineType({ name: 'localeString', title: 'Texte court', type: 'object', options, fields: localeFields('string') });
export const localeText = defineType({ name: 'localeText', title: 'Texte', type: 'object', options, fields: localeFields('text') });
export const localeBlocks = defineType({ name: 'localeBlocks', title: 'Texte riche', type: 'object', options, fields: localeFields('blocks') });
