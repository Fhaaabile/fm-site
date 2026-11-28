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
| `SANITY_API_READ_TOKEN` | Jeton Sanity, droit Viewer | Oui |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `91cstvku` (valeur par défaut dans le code) | Non |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (valeur par défaut dans le code) | Non |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site, par environnement | Non |

Les pages hors production ne sont pas indexées (`robots: noindex` tant que `VERCEL_ENV` n'est pas `production`).

## Commandes

```bash
npm run dev        # serveur local
npm run typecheck  # types
npm run build      # build de production
```

## Studio Sanity (`/studio`)

Le contenu du site s'édite dans le studio Sanity, servi par le site lui-même à l'adresse `/studio` (en local : http://localhost:3000/studio ; sur staging : https://staging.fabienmichaud.com/studio). Il se déploie avec le site, à chaque PR. Il ne charge rien du site (ni styles, ni en-tête) et n'est jamais indexé.

- **Accès** : une connexion Sanity (compte du projet `91cstvku`). Avant le lancement, `/studio` est aussi derrière la protection Vercel du staging.
- **Une fois, dans Sanity** : sur https://www.sanity.io/manage → projet → API → CORS origins, ajouter chaque adresse qui sert le studio, avec « Allow credentials » coché : `http://localhost:3000`, `https://staging.fabienmichaud.com`, `https://fabienmichaud.com`, et les aperçus Vercel (`https://*.vercel.app`, ou l'adresse de l'équipe). Sans cela, le studio affiche « Couldn't reach the Sanity servers ».
- **Où vit le modèle** : `sanity.config.ts` (racine) et `src/sanity/` (types de documents, structure de la barre latérale, listes fermées reprises du design system, requêtes GROQ dans `queries.ts`). Chaque champ correspond à une prop d'un composant du design system ; les icônes proposées sont celles du paquet (`ANIMATED_ICON_NAMES`).
- **Types des requêtes** : `src/sanity/sanity.types.ts` vient de l'ancien studio du design system. Les régénérer (`npx sanity typegen generate`) demandera un point d'entrée léger des noms d'icônes dans le paquet : à venir.

## Mettre à jour le design system

Une nouvelle version du paquet sort quand la PR « Version du paquet » est fusionnée dans `fm-design-system`. Côté site : `npm install @fhaaabile/fm-design-system@latest` dans une PR, vérifiée sur son aperçu Vercel.
