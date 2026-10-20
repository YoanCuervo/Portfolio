# Portfolio — Spécifications version mobile (≤ 428 px)

Ce document accompagne les maquettes `docs/maquette-mobile/Main.dc.html` (page complète) et `Ecran.dc.html` (vue 428 × 926 avec la barre fixe). Il fait foi en cas de doute : la maquette montre le rendu, ce fichier donne les règles.

## 0. Avant de commencer

- **Ne pas copier le HTML des maquettes.** Ce sont des fichiers d'un outil de design :
  - `<sc-if>`, `<sc-for>` et `<dc-import>` sont des balises de l'outil, à recoder en React (conditionnel, `.map()`).
  - `{{accent}}` vaut `#d4a574` (`--halo-amber`).
  - Tous les styles sont en ligne : les ranger dans les `.module.css` existants, avec les variables CSS du projet à la place des couleurs en dur.
- **Corriger d'abord le débordement horizontal.** À 435 px, la page mesure aujourd'hui 564 px de large (`document.documentElement.scrollWidth`). Il faut trouver l'élément responsable (nav en `flex` sans `wrap`, ou largeur fixe) avant d'ajouter les media queries.
- **Ne pas toucher au desktop.** Toutes les règles ci-dessous s'appliquent dans `@media (max-width: 428px)`.

## 1. Tokens

### Couleurs

| Rôle | Valeur | Variable existante |
|---|---|---|
| Fond de page | `#0f0f0f` | — |
| Texte principal | `#e8e4df` | — |
| Texte secondaire | `#c9c3bb` | — |
| Texte atténué | `#9a9590` | — |
| Accent | `#d4a574` | `--halo-amber` |
| Accent doré (pastilles) | `#c9b896` | `--halo-gold` |
| Accent rose (badges) | `#e8b4b8` | `--halo-rose` |
| Fond de card | `#181716` | — |
| Bordure de card / filets | `#34302c` | — |
| Cadre pointillé | `#6e6558` | — |

### Typographie

- Titres : `var(--font-serif)` (Cormorant), graisse 600.
- Texte : `var(--font-sans)` (IBM Plex Sans), graisse 300, 16 px, `line-height: 1.6`.

| Élément | Taille | Détail |
|---|---|---|
| h1 (nom) | 48 px | `line-height: 1.05` |
| Sous-titre « Développeur web » | 34 px | italique, graisse 400, accent |
| h2 de section | 42 px | `line-height: 1.1` |
| h3 catégorie de compétences | 24 px | graisse 500, accent |
| Titre de card projet | 30 px | |
| Libellé d'onglet (barre du bas) | 12 px | graisse 400, 500 si actif |

### Espacements

À mettre en variables :

```css
--gutter: 36px;     /* marges latérales de toutes les sections, header et footer */
--section-y: 72px;  /* padding vertical des sections */
--tabbar-h: 64px;
```

Le hero fait exception : `72px 36px 80px`.

## 2. Structure de la page

Ordre : header → hero → compétences → projets → à propos → références → contact → footer, plus la barre d'onglets fixe.

Chaque section est séparée par un filet de 1 px `rgba(232,228,223,0.08)` en haut.

## 3. Header

- Hauteur 64 px, `padding: 0 28px 0 var(--gutter)`, filet bas `rgba(232,228,223,0.10)`.
- À gauche : « Yoan Cuervo » en Cormorant 24 px, graisse 600. Le lien ramène en haut de page.
- À droite : bouton langue et bouton thème, de 44 × 44 px chacun.
- **Pas de burger.** La navigation est assurée par la barre du bas.

## 4. Barre d'onglets fixe (nouvelle)

- `position: fixed; bottom: 0; left: 0; right: 0;`
- Hauteur `var(--tabbar-h)`, plus `padding-bottom: env(safe-area-inset-bottom)`. Ajouter `viewport-fit=cover` dans la meta viewport, sinon `env()` renvoie 0.
- Fond `#0f0f0f`, filet haut 1 px `#34302c`.
- 4 onglets en `grid-template-columns: repeat(4, 1fr)`. Pas d'onglet Accueil.
- Chaque onglet : icône au-dessus (22 px, `strokeWidth={1.6}`), libellé en dessous (12 px), écart de 4 px. Zone cliquable de 64 px de haut.

| Onglet | Ancre | Icône lucide-react |
|---|---|---|
| Compétences | `#skills` | `CodeXml` |
| Projets | `#projects` | `BookBookmark` |
| À propos | `#about` | `User` |
| Contact | `#contact` | `Mail` |

- Inactif : couleur `#9a9590`.
- Actif : couleur accent, graisse 500, `aria-current="true"`, et un trait de 28 × 2 px en accent centré sur le filet du haut.
- L'onglet actif suit la section visible grâce à un `IntersectionObserver` sur les 4 sections. Dans le hero, aucun onglet n'est actif.
- Le `body` reçoit `padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom))` pour que le footer ne passe pas sous la barre.
- Au-dessus de 428 px, la barre est masquée et la nav desktop réapparaît.
- La barre est une `<nav aria-label="Navigation principale">` qui contient une `<ul>`.

## 5. Hero

- Nom, puis sous-titre, puis les 4 icônes sociales (cercles de 44 px, bordure `rgba(232,228,223,0.22)`), puis l'intro.
- L'intro tient en 3 paragraphes. Le premier (« Bonjour ! … ») est en 17 px, couleur principale. Les deux autres sont en couleur secondaire.
- **Pas de boutons d'appel à l'action** : ils ont été retirés volontairement.
- Fond : halo radial léger, `radial-gradient(120% 60% at 80% 0%, rgba(212,165,116,0.16), transparent 70%)`.

## 6. Compétences

- 5 groupes empilés, écart de 22 px : Langages, Frontend, Backend, Outils, En apprentissage.
- Chaque groupe : un h3, puis des pastilles en `flex-wrap`, écart de 8 px.
- Pastille : `padding: 6px 14px`, rayon 999 px, bordure 1 px `rgba(232,228,223,0.18)`, 14 px.
- Groupe « En apprentissage » : bordure en **pointillés** et texte secondaire, pour distinguer ce qui est en cours d'apprentissage.
- Certifications : 2 blocs empilés. Chacun contient le titre, le badge de date et la ligne RNCP.

## 7. Projets — carrousel

### Comportement

- Une seule card visible à la fois, 3 slides : Wedoo, Poke_Gacha, Projet 3.
- Sous la card :
  - à gauche et à droite, les boutons Précédent et Suivant (cercles de 44 px). La navigation boucle.
  - au centre, 3 points cliquables (zone de 32 × 44 px) et un compteur « 1 / 3 ».
- Point actif : 24 × 6 px en accent. Points inactifs : 6 × 6 px, `rgba(232,228,223,0.35)`.
- **Swipe tactile obligatoire.** Le recommandé : `scroll-snap-type: x mandatory` sur le conteneur et `scroll-snap-align: center` sur les slides, sans librairie. Les boutons et les points restent, pour l'accessibilité.
- Accessibilité : le conteneur a `role="region"`, `aria-roledescription="carrousel"` et `aria-label="Projets"`. La zone des slides a `aria-live="polite"`. Les boutons ont un `aria-label`.
- « Voir tous les projets » est aligné à droite, en Cormorant 24 px italique, accent, souligné (`text-underline-offset: 4px`).

### Card projet (reprise de la DA desktop)

- Angles droits, fond `#181716`, bordure 1 px `#34302c`, `position: relative; overflow: hidden`.
- Cadre pointillé décoratif : un élément en `position: absolute; inset: 14px`, bordure 1 px dashed `#6e6558`, `pointer-events: none`, `aria-hidden="true"`.
- Badge (« Projet d'équipe » ou « Projet solo ») : en `absolute`, `top: 14px; right: 14px`, hauteur 28 px, bordure 1 px `#e8b4b8`, rayon 2 px, texte rose 13 px.
- Zone image : 200 px de haut. Le texte alternatif doit être spécifique, par exemple « Capture d'écran de Wedoo ».
- Corps : `padding: 0 28px 64px`, écart de 14 px.
  - Titre en Cormorant 30 px, type de projet en 14 px `#9a9590`.
  - « Le projet » et « Sa construction » sont **empilés**, pas en 2 colonnes comme sur desktop. Le second bloc est séparé par un filet haut 1 px `#34302c` et 16 px de padding.
  - Intertitres en 14 px graisse 500, textes en 14 px graisse 300 `#9a9590`.
- Pastilles techno : hauteur 28 px, `padding: 0 12px`, rayon 999 px, bordure 1 px `#c9b896`, fond `#0f0f0f`, 13 px, centrées.
- Lien GitHub : en `absolute`, `right: 14px; bottom: 6px`, hauteur min 44 px. Il contient l'icône GitHub, le texte « GitHub » en accent souligné et une flèche. Mettre un `aria-label` qui indique l'ouverture dans un nouvel onglet.
- Le projet 3 n'a pas de badge ni de lien GitHub tant que son contenu n'est pas rempli.

## 8. À propos

- h2, puis une phrase d'accroche en Cormorant 27 px italique accent, puis 4 paragraphes (le dernier en couleur principale, graisse 400).
- Soft skills : mêmes pastilles que la section Compétences.

## 9. Références

- Titre « Ils m'ont fait confiance » : 13 px, majuscules, `letter-spacing: 0.08em`, centré.
- 2 lignes de logos défilantes, la seconde décalée. Bords en fondu avec `mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)`.
- Les copies de logos dupliquées pour la boucle portent `aria-hidden="true"`.

## 10. Contact

- Champs empilés, écart de 18 px. Chaque champ a un `<label>` relié par `for`.
- Hauteur des inputs 52 px. **Police à 16 px minimum**, sinon iOS zoome automatiquement au focus.
- `type="email"`, `inputmode="email"`, `autocomplete="name"` et `autocomplete="email"`.
- Textarea de 6 lignes, redimensionnable verticalement.
- Bouton « Envoyer ma demande » en pleine largeur, 52 px de haut, fond accent, texte `#0f0f0f`.

## 11. Footer

- « © 2026 Yoan Cuervo » à gauche, « Haut de page ↑ » à droite (zone de 44 px de haut).
- `padding: 24px var(--gutter) 32px`.

## 12. Accessibilité (transversal)

- Zones cliquables d'au moins 44 × 44 px.
- Contraste du texte d'au moins 4.5:1 sur `#0f0f0f`. Les couleurs listées plus haut le respectent.
- Icônes décoratives en `aria-hidden="true"`. Boutons ne contenant qu'une icône : `aria-label` obligatoire.
- Garder les liens d'ancre fonctionnels sans JavaScript.

## 13. Points ouverts (non tranchés)

- **Arrondis.** Sur desktop, les boutons, les champs et le bloc formulaire ont des angles droits. La maquette mobile les arrondit (pastilles, boutons, inputs, blocs certifications). Il faut choisir de s'aligner sur le desktop (recommandé) ou de garder les arrondis.
- **Bouton langue.** Le desktop affiche un drapeau, la maquette mobile un texte « EN ». À aligner sur le desktop.
- **Projet 3.** Le contenu est provisoire (textes entre crochets). Il faut le remplir ou le retirer du carrousel avant la mise en ligne.
