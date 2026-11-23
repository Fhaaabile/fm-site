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

## Mettre à jour le design system

Une nouvelle version du paquet sort quand la PR « Version du paquet » est fusionnée dans `fm-design-system`. Côté site : `npm install @fhaaabile/fm-design-system@latest` dans une PR, vérifiée sur son aperçu Vercel.
