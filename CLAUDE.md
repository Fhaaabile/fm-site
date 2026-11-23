# Instructions pour Claude

Ce repo est le site de production de Fabien Michaud. Lire `README.md` avant toute modification.

## Règles

- Toute modification passe par une branche et une pull request vers `staging`. Ne jamais pousser sur `main` ni sur `staging`, ne jamais fusionner. La mise en production est une PR `staging` → `main`, fusionnée par Fabien.
- Les composants viennent du paquet `@fhaaabile/fm-design-system`. Un composant ou un token qui manque se crée dans le repo `fm-design-system` (PR, version du paquet), pas ici. Le CSS du site se limite à la mise en page, avec des variables `--fm-*` uniquement.
- Le repo `Fhaaabile/wino-design-system` reste en lecture seule : aucune modification depuis ce projet.
- Aucun secret dans le repo : jetons et clés vivent dans les variables d'environnement (local, Vercel).
- Textes d'interface en français, casse de phrase, sans emoji ; vouvoiement quand on s'adresse au visiteur, tournures neutres ailleurs, « je » pour Fabien.
- Sobriété : un geste fort par page au plus ; pas d'appel en plus du pied de page « Parlons-en » ; `prefers-reduced-motion` respecté.
- Avant d'ouvrir une PR : `npm run typecheck` et `npm run build` doivent passer.
