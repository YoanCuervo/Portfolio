# Portfolio Yoan Cuervo

Site vitrine statique d'un développeur web fullstack : une page d'accueil en cinq sections plein écran (Hero, Skills, Projects, About, Contact) et une page `/projects`. Deux thèmes (sombre, clair), deux langues (anglais, français). Hébergé sur GitHub Pages, sans backend.

## Source de vérité

`docs/ARCHITECTURE.md` décrit tout : couleurs, tailles, textes, comportements, backlog. Ne pas le charger en entier à chaque session : lire la section utile au ticket en cours.

| Besoin | Section |
|---|---|
| Décisions figées, hors périmètre | 2 |
| Routes, ancres | 3 |
| Arborescence | 4 |
| Couleurs, typographie, composants d'interface | 5 |
| Spécification d'une section ou d'une page | 6 |
| Animations | 7 |
| Thème, langue, textes français | 8 |
| Accessibilité | 9 |
| Contenus manquants | 12 |
| Tickets et critères de fin | 13 |

Si une demande contredit ce document, le dire avant de coder. Si le document est muet ou ambigu, poser la question plutôt que d'inventer. Les points marqués [PROPOSÉ] doivent être validés par Yoan avant le ticket concerné.

## Commandes

```bash
npm run dev       # serveur local
npm run build     # compilation TypeScript + build de production dans dist/
npm run preview   # sert dist/ en local, pour vérifier le build avec le préfixe `base`
npm run check     # Biome (lint + format) et tsc --noEmit
```

Ces scripts sont créés au ticket T01.

## Stack

React, Vite, TypeScript, React Router (`HashRouter`), CSS Modules, Biome. Polices auto-hébergées (`@fontsource/cormorant`, `@fontsource/ibm-plex-sans`). Icônes de techno : `simple-icons`.

Aucune autre dépendance sans accord explicite de Yoan. Pas de framework CSS, pas de bibliothèque d'animation, pas de bibliothèque d'internationalisation, pas de bibliothèque de formulaire.

## Règles de code

- Code, noms de fichiers, identifiants de section et clés de traduction en anglais.
- Un composant par fichier, avec son `Nom.module.css` à côté.
- Aucune couleur ni graisse de police en dur : uniquement les variables de `src/styles/tokens.css`.
- Aucun texte visible en dur dans un composant : tout vient de `src/locales/` via `useLanguage()`. `fr.ts` est typé `typeof en`.
- `src/data/` ne contient que ce qui ne se traduit pas (identifiants, technos, URL, images).
- Pas de style en ligne (`style={{…}}`), sauf pour passer une variable CSS calculée, par exemple `--i` pour un décalage d'animation.
- Images importées depuis `src/assets`, jamais de chemin absolu `/…` écrit à la main.
- HTML sémantique : un seul `h1` par page, niveaux de titres sans saut, `button` pour une action, `a` pour une navigation.
- Tout bouton sans texte a un `aria-label` traduit. Toute icône décorative a `aria-hidden="true"` ou `alt=""`.
- Toute animation est neutralisée sous `prefers-reduced-motion: reduce`.
- Pas de commentaire qui répète le code. Un commentaire seulement pour expliquer un choix non évident.

## Pièges connus

- **Ancres** : avec `HashRouter`, un `<a href="#skills">` casse la route. Utiliser `scrollToSection(id)`. Depuis `/projects`, passer par `navigate('/', { state: { scrollTo: id } })`.
- **Préfixe GitHub Pages** : `base` dans `vite.config.ts` vaut le nom du dépôt. Toujours vérifier avec `npm run preview`, pas seulement `npm run dev`.
- **Flash de thème** : `data-theme` est posé sur `<html>` par un script en ligne dans `index.html`, avant React. Ne pas déplacer cette logique dans un `useEffect`.
- **`localStorage`** : lecture et écriture dans un `try/catch`, le site doit fonctionner sans.
- **Carrousel** : chaque rangée contient la liste deux fois, la seconde copie en `aria-hidden`. La boucle repose sur `translateX(-50%)` : ne pas ajouter de `gap` entre les deux copies.
- **Maquettes** : elles sont en style en ligne et en largeur fixe de 1440 px. Ce sont des contraintes de l'outil de maquette, pas un modèle de code.

## Méthode de travail

1. Un ticket à la fois, dans l'ordre de la section 13. Ne pas déborder du ticket, même pour « améliorer au passage ».
2. Avant de coder : annoncer en quelques lignes les fichiers créés ou modifiés et l'approche, puis attendre l'accord de Yoan.
3. Une branche par ticket : `feat/T08-hero`, `chore/T01-init`, `fix/…`.
4. Commits en anglais, format Conventional Commits : `feat(hero): add animated name`.
5. Avant de dire qu'un ticket est fini : `npm run check` et `npm run build` passent, et les critères du ticket sont repris un par un avec leur état.
6. Ne jamais pousser sur `main` directement : `main` déclenche la mise en ligne. Passer par une demande de fusion.
7. Ne jamais annoncer qu'un rendu est conforme sans l'avoir vu. Sinon, lister ce que Yoan doit vérifier à l'écran.

## Définition de fini

Un ticket est fini quand ses critères (section 13) sont remplis :

- dans les deux thèmes ;
- dans les deux langues ;
- au clavier seul, avec un focus visible ;
- avec `prefers-reduced-motion` activé ;
- sans erreur Biome ni TypeScript, sans erreur ni avertissement dans la console du navigateur.

## Travailler avec Yoan

- Répondre en français, de façon directe. Si une demande est inutile ou mal orientée, le dire clairement et proposer mieux.
- Recommander une solution, pas une liste d'options.
- Yoan est en formation (HTML, CSS, JavaScript, React, Node.js ; SQL, API et `fetch` en cours). Il doit pouvoir expliquer chaque ligne de ce dépôt en entretien. Donc :
  - préférer la solution la plus simple qui marche à la plus élégante ;
  - pas d'abstraction avant le deuxième cas d'usage réel ;
  - quand un concept dépasse son programme (IntersectionObserver, contexte React, types génériques), l'expliquer en trois ou quatre phrases dans la réponse, pas dans le code ;
  - ne pas réexpliquer ce qui est déjà acquis.
- Ne pas inventer de contenu : ce qui manque reste entre crochets jusqu'au ticket T20.

## Ne pas faire

- Ajouter un backend, une base de données, un CMS, des statistiques de visite.
- Créer une page de détail par projet ou un bouton de téléchargement du CV : retirés du périmètre.
- Coder la version mobile avant que sa maquette existe (ticket T21 bloqué). Ne pas inventer de menu mobile.
- Remettre en cause une décision marquée [FIGÉ].
- Écrire l'adresse mail de Yoan dans le dépôt : elle reste configurée côté service de formulaire.
