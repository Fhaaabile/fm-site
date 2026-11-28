# fm-site

Site de Fabien Michaud ([fabienmichaud.com](https://fabienmichaud.com)) : Next.js 16 (App Router), composants du design system privé `@fhaaabile/fm-design-system`, contenus dans Sanity, hébergé sur Vercel.

Le plan, le ton et les textes viennent du doc « Site de production : architecture, positionnement et rédaction ». Le design system (composants, tokens, décisions) vit dans le repo `fm-design-system`.

## Branches

| Branche | Rôle | Adresse |
| --- | --- | --- |
| `main` | Production | fabienmichaud.com (au lancement) |
| `staging` | Recette, protégée par Vercel Authentication | staging.fabienmichaud.com |
| `feat/…`, `fix/…` | Une PR chacune, vers `staging` | Aperçu Vercel par PR |

Une fois `staging` validé, une PR `staging` → `main` met en production.

## Démarrer en local

1. Un jeton GitHub (classic, droit `read:packages`) dans la variable `NPM_TOKEN` de votre shell (`export NPM_TOKEN=…` dans `~/.zshrc`). Le `.npmrc` du repo le lit pour installer le design system ; il n'est jamais écrit dans le repo.
2. `cp .env.example .env.local`, puis remplir `SANITY_API_READ_TOKEN` si besoin.
3. `npm install`, puis `npm run dev` : http://localhost:3000.

## Variables d'environnement (Vercel)

| Nom | Valeur | Secret |
| --- | --- | --- |
| `NPM_TOKEN` | Jeton GitHub `read:packages` | Oui |
| `SANITY_API_READ_TOKEN` | Jeton Sanity, droit Viewer : brouillons et aperçu en direct | Oui |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `91cstvku` (valeur par défaut dans le code) | Non |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (valeur par défaut dans le code) | Non |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site, par environnement | Non |

Les pages hors production ne sont pas indexées (`robots: noindex` tant que `VERCEL_ENV` n'est pas `production`).

## Commandes

```bash
npm run dev        # serveur local
npm run typecheck  # types
npm run build      # build de production
npm run typegen    # types des requêtes Sanity
npm run seed       # import de départ dans Sanity (voir plus bas)
```

## Studio Sanity (`/studio`)

Le contenu du site s'édite dans le studio Sanity, servi par le site lui-même à l'adresse `/studio` (en local : http://localhost:3000/studio ; sur staging : https://staging.fabienmichaud.com/studio). Il se déploie avec le site, à chaque PR. Il ne charge rien du site (ni styles, ni en-tête) et n'est jamais indexé.

- **Accès** : une connexion Sanity (compte du projet `91cstvku`). Avant le lancement, `/studio` est aussi derrière la protection Vercel du staging.
- **Une fois, dans Sanity** : sur https://www.sanity.io/manage → projet → API → CORS origins, ajouter avec « Allow credentials » coché, et seulement ces trois adresses : `http://localhost:3000`, `https://staging.fabienmichaud.com`, `https://fabienmichaud.com`. Sans cela, le studio affiche « Couldn't reach the Sanity servers ». L'avertissement de Sanity est normal : toute page servie par une de ces adresses peut agir en ton nom quand tu es connecté au studio. D'où deux règles : jamais de joker (`https://*.vercel.app` ouvrirait l'accès à n'importe quel site hébergé chez Vercel), et pas d'aperçus Vercel dans la liste (le studio s'essaie sur staging ou en local). Ces mêmes origines servent aussi la mise à jour en direct des pages : sur un aperçu Vercel, les pages restent justes mais ne se mettent pas à jour toutes seules.
- **Où vit le modèle** : `sanity.config.ts` (racine) et `src/sanity/` (types de documents, structure de la barre latérale, listes fermées reprises du design system, requêtes GROQ dans `queries.ts`). Chaque champ correspond à une prop d'un composant du design system ; les icônes proposées et le monogramme viennent du point d'entrée léger du paquet (`@fhaaabile/fm-design-system/data`).
- **Types des requêtes** : `npm run typegen` extrait le modèle (`src/sanity/schema.json`) et régénère `src/sanity/sanity.types.ts`. À relancer après chaque changement du modèle ou d'une requête.

### Pages lues dans Sanity

L'accueil, la page Projets et les études de cas (`/projets/<adresse>`) lisent leur contenu dans Sanity ; les autres pages suivront. Une section sans contenu ne s'affiche pas.

- **Publication** : une page publiée se met à jour dès qu'un document change (Live Content API), sans reconstruire le site. Une nouvelle étude de cas publiée après le dernier déploiement est rendue à la première visite.
- **Aperçu en direct** : outil « Aperçu » du studio. La page du site s'affiche à côté du formulaire, en mode brouillon ; un clic sur un texte ouvre son champ. Il demande le jeton `SANITY_API_READ_TOKEN` (droit Viewer) dans Vercel : sans lui, le site ne montre que le contenu publié. Quitter le mode brouillon hors du studio : `/api/draft-mode/disable`.

### Contenu de départ

`sanity/seed/` contient un import de départ : le contenu d'exemple des pages du design system (réglages, six projets dont une étude de cas complète, services, témoignages, Lab, convictions), avec des visuels abstraits. Il se remplace au fil de l'eau dans le studio.

```bash
npx sanity login   # une fois, avec ton compte Sanity
npm run seed       # importe sanity/seed dans le dataset production ; un document qui existe déjà n'est pas touché
```

Le fichier se régénère avec `node scripts/seed/build-seed.mjs` (le contenu est écrit dans ce script). Les réseaux et les logos clients ne sont pas dans l'import : à saisir avec les vrais liens et les vrais logos.

## Mettre à jour le design system

Une nouvelle version du paquet sort quand la PR « Version du paquet » est fusionnée dans `fm-design-system`. Côté site : `npm install @fhaaabile/fm-design-system@latest` dans une PR, vérifiée sur son aperçu Vercel.
