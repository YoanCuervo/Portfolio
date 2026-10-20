# Portfolio Yoan Cuervo — cahier d'architecture

Document de référence pour construire le backlog et coder le site avec Claude Code.
Il décrit l'état validé des maquettes bureau (version 47 du canvas, 8 octobre 2026). Toutes les valeurs (couleurs, tailles, textes) sont relevées dans le code des maquettes, pas estimées.

Conventions de lecture :

- **[FIGÉ]** : décidé, ne pas rediscuter.
- **[PROPOSÉ]** : mon choix par défaut, absent des maquettes ou jamais tranché. À valider avant le ticket concerné.
- **[À FOURNIR]** : contenu que seul Yoan peut donner (lien, image, texte).

---

## 1. Le projet en bref

Site vitrine personnel d'un développeur web fullstack en reconversion (ancien premier assistant réalisateur). Une page d'accueil en cinq sections plein écran, plus une page qui liste tous les projets. Deux thèmes (sombre, clair), deux langues (anglais, français).

Objectif : qu'un recruteur comprenne en moins d'une minute qui est Yoan, ce qu'il sait faire, ce qu'il a construit, et puisse lui écrire.

## 2. Décisions figées

| Sujet | Décision |
|---|---|
| Framework | React + Vite **[FIGÉ]** (Next.js écarté) |
| Hébergement | GitHub Pages, site 100 % statique **[FIGÉ]** |
| Backend | Aucun **[FIGÉ]** |
| Routage | React Router en `HashRouter` **[FIGÉ]** (pas de configuration serveur possible sur GitHub Pages) |
| Formulaire de contact | Service de formulaire tiers qui relaie vers la boîte mail de Yoan **[FIGÉ]**. Service : Web3Forms via `fetch` (validé à T13 ; pas de dépendance, cohérent avec l'apprentissage de `fetch`). |
| Langues | Anglais et français, un fichier de textes par langue **[FIGÉ]** |
| Thèmes | Sombre (Dark Botanical) et clair, bouton de bascule dans la navigation **[FIGÉ]** |
| Langage | TypeScript **[PROPOSÉ]** (déjà affiché dans la stack et utilisé sur Wedoo et Poke_Gacha) |
| Styles | CSS Modules + variables CSS pour les thèmes, pas de framework CSS **[PROPOSÉ]** |
| Lint et format | Biome **[PROPOSÉ]** (déjà dans la liste d'outils du site) |
| Internationalisation | Petit contexte React maison, pas de bibliothèque **[PROPOSÉ]** (deux langues, une centaine de chaînes : une bibliothèque serait du poids inutile) |
| Polices | Auto-hébergées via `@fontsource` **[PROPOSÉ]** (les maquettes les chargent depuis Google Fonts ; l'auto-hébergement évite une requête tierce) |

Hors périmètre : page de détail par projet (`/projects/:slug`), téléchargement du CV (retiré), blog, CMS, statistiques de visite, tests unitaires (inutiles ici : le typage des fichiers de langue suffit à garantir que les deux langues ont les mêmes clés).

## 3. Routes

| URL (HashRouter) | Page | Contenu |
|---|---|---|
| `/#/` | `HomePage` | Hero, Skills, Projects (3 projets mis en avant), About, Contact + pied de page |
| `/#/projects` | `ProjectsPage` | Lien retour, titre, tous les projets, pied de page |
| toute autre | redirection vers `/#/` | |

### Piège du HashRouter : les ancres

Avec `HashRouter`, le `#` de l'URL sert déjà au routage. Un lien `<a href="#skills">` casserait la route. Donc :

- Les liens de navigation appellent une fonction `scrollToSection(id)` qui fait `document.getElementById(id)?.scrollIntoView()`. Avant de défiler, elle envoie l'événement `section-navigate` (avec l'`id`) : la section visée rejoue son animation d'entrée (`useReveal(id)`, voir 7).
- Depuis `/projects`, un clic sur Skills, About ou Contact fait `navigate('/', { state: { scrollTo: id } })`. `HomePage` lit cet état dans un `useEffect` et défile vers la section.
- Chaque section a `scroll-margin-top: 72px` (hauteur de la navigation) : à l'arrivée sur une section, son haut se cale sous la barre. L'espace du haut des sections ne compte donc pas la barre (17 octobre 2026) : 48 px pour Projects et Contact, 56 px pour About, 0 pour Skills, dont le contenu est centré.
- Le défilement est doux (`scroll-behavior: smooth`), sauf si `prefers-reduced-motion: reduce`.
- Au rechargement, la page repart toujours en haut : la restauration du défilement du navigateur est désactivée (`history.scrollRestoration = "manual"` dans `main.tsx`).

## 4. Arborescence cible

```
portfolio/
├── .github/workflows/deploy.yml
├── public/                         servi tel quel (balises de index.html)
│   ├── favicon.png                 monogramme YC de Yoan, noir sur blanc cassé, 180 px (T18)
│   └── og-image.png                image d'aperçu de lien, 1200 × 630 (T18)
├── scripts/share-images/           sources HTML des deux images ci-dessus et monogramme d'origine
├── src/
│   ├── main.tsx
│   ├── App.tsx                     HashRouter + providers + routes
│   ├── styles/
│   │   ├── tokens.css              variables des deux thèmes
│   │   └── base.css                reset, typographie, focus, reduced-motion
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/
│   │   ├── useReveal.ts            apparition à l'entrée dans l'écran (IntersectionObserver)
│   │   └── useActiveSection.ts     section visible, pour souligner le lien de navigation
│   ├── locales/
│   │   ├── en.ts                   source de vérité des clés
│   │   └── fr.ts                   typé `typeof en`
│   ├── data/
│   │   ├── skills.ts
│   │   ├── certifications.ts
│   │   ├── projects.ts
│   │   ├── softSkills.ts
│   │   ├── clients.ts
│   │   └── codeGlyphs.ts           caractères du champ de code du hero (T22)
│   ├── assets/
│   │   ├── icons/                  SVG en `currentColor` (source : paquet simple-icons)
│   │   ├── flags/                  fr.svg, gb.svg
│   │   ├── projects/               captures d'écran [À FOURNIR]
│   │   └── logos/                  logos productions/clients [À FOURNIR]
│   ├── components/
│   │   ├── layout/   Navbar, TabBar, Footer, Section, BlurDecor, SkipLink
│   │   ├── ui/       Pill, Tag, IconLink, ArrowLink, TechIcon, TabIcon
│   │   ├── hero/     Hero, AnimatedName, AnimatedRole, CodeField
│   │   ├── skills/   Skills, StackRow, CertificationItem
│   │   ├── projects/ ProjectsSection, ProjectCarousel, FeaturedProjectCard, ProjectRow, ProjectCard
│   │   ├── about/    About, Marquee, ClientTile
│   │   └── contact/  Contact, ContactForm, Field
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ProjectsPage.tsx
│   └── utils/
│       └── scrollToSection.ts     défilement vers une section (le HashRouter interdit les ancres)
├── index.html                      script anti-flash du thème, balises meta
├── vite.config.ts                  `base` = nom du dépôt
├── biome.json
└── tsconfig.json
```

Règle de nommage : code, noms de fichiers, identifiants de section et clés de traduction en anglais. Les identifiants de section des maquettes sont en français (`accueil`, `competences`, `projets`, `a-propos`) : dans le code, utiliser `home`, `skills`, `projects`, `about`, `contact`.

## 5. Système de design

### 5.1 Couleurs (variables CSS sur `html[data-theme]`)

| Variable | Rôle | Sombre | Clair |
|---|---|---|---|
| `--bg` | Fond de page et de navigation | `#0f0f0f` | `#e8e4df` |
| `--fg` | Texte principal, titres | `#e8e4df` | `#0f0f0f` |
| `--muted` | Texte secondaire, paragraphes | `#9a9590` | `#5c5751` |
| `--accent` | Liens, sous-titres en italique, contour de focus | `#d4a574` | `#7d4f22` |
| `--accent-hover` | Lien survolé | `#e8b4b8` | `#0f0f0f` |
| `--rose` | Étiquettes (équipe, statut de certification) | `#e8b4b8` | `#8f3f4b` |
| `--gold` | Bordure des pastilles, filet vertical du hero | `#c9b896` | `#8f7d4f` |
| `--icon` | Teinte des icônes de techno et de réseaux | `#c9b896` | `#5f5030` |
| `--line` | Séparateurs, bordure des cards | `#34302c` | `#c9c2b8` |
| `--card` | Fond des cards projet | `#181716` | `#f4f1ed` |
| `--form-bg` | Fond du cadre du formulaire et des champs (noir des pastilles en sombre, 16 octobre 2026) | `#0f0f0f` | `#f4f1ed` |
| `--control` | Bordure des boutons ronds, champs, zones en pointillés | `#6e6558` | `#7d746a` |
| `--tile-bg` | Fond des tuiles du carrousel, blanc du site en sombre (T23) | `var(--fg)` | `#f4f1ed` |
| `--tile-fg` | Nom dans une tuile sans logo (T23) | `#0f0f0f` | `var(--fg)` |
| `--tile-border` | Bordure des tuiles du carrousel | `#34302c` | `#b5ada1` |
| `--btn-bg` | Bouton d'envoi, fond | `#d4a574` | `#0f0f0f` |
| `--btn-fg` | Bouton d'envoi, texte | `#0f0f0f` | `#e8e4df` |
| `--hole` | Ombre du trou noir du champ de code (T22) | `#0f0f0f` | `var(--bg)` |
| `--lens` | Code aspiré par la lentille et anneau (T22) | `var(--accent)` | `var(--rose)` |
| `--code` | Code au repos du champ de code (20 octobre 2026 : en clair, même rose que la lentille au lieu de `--gold`) | `var(--gold)` | `var(--lens)` |
| `--code-intensity` | Multiplie toutes les opacités du champ de code (T22) : un texte foncé sur fond clair se perçoit beaucoup moins bien | 1 | 4 |
| `--shadow` | Ombre d'une card projet soulevée au survol (T15) | `rgba(0, 0, 0, 0.55)` | `rgba(15, 15, 15, 0.16)` |
| `--scrim` | Voile derrière le texte d'une `FeaturedProjectCard` posée sur sa capture (T19) | `rgba(0, 0, 0, 0.78)` | `rgba(255, 255, 255, 0.65)` |
| `--pill-bg` | Pastille au repos, fond (T15) | `#0f0f0f` | `#ffffff` |
| `--pill-fg` | Pastille au repos, texte | `var(--fg)` | `#0f0f0f` |
| `--pill-icon` | Pastille au repos, logo | `var(--fg)` (blanc) | `var(--icon)` (doré) |
| `--pill-hover-bg` | Pastille survolée, fond | `var(--fg)` | `#0f0f0f` |
| `--pill-hover-fg` | Pastille survolée, texte | `#0f0f0f` | `#e8e4df` |
| `--pill-hover-icon` | Pastille survolée, logo | `#8f7d4f` (doré) | `#e8e4df` (blanc) |
| `--w-body` | Graisse du texte courant | 300 | 400 |
| `--w-lead` | Graisse des paragraphes du hero : identique dans les deux thèmes, pour que le texte passe à la ligne aux mêmes endroits et que le nom ne bouge pas au changement de thème | 400 | 400 |
| `--w-italic` | Graisse de « Web Developer » | 400 | 500 |

Les trois couleurs des halos décoratifs sont identiques dans les deux thèmes : `#d4a574`, `#e8b4b8`, `#c9b896`. Seule leur opacité change (voir 5.4).

### 5.2 Typographie

- Titres : **Cormorant** (serif). Graisses utilisées : 400, 600, italique 400, italique 500.
- Texte : **IBM Plex Sans**. Graisses utilisées : 300, 400, 500.
- Champ de code du hero (T22) : police à chasse fixe du système, `--font-mono: ui-monospace, Consolas, monospace` (aucune police chargée).
- Taille de base : 16 px.

| Élément | Police | Taille | Graisse | Interligne | Couleur |
|---|---|---|---|---|---|
| Nom du hero (`h1`) | Cormorant | `clamp(52px, 9vw, 132px)` | 600 | 1 | `--fg` |
| « Web Developer » | Cormorant italique | 52 px | `--w-italic` | 1.1 | `--accent` |
| Paragraphes du hero | Plex Sans | 18 px | `--w-lead` | 1.6 | `--muted` |
| Titre de section (`h2`) | Cormorant | 60 px | 600 | 1 | `--fg` |
| Titre de `/projects` (`h1`) | Cormorant | 76 px | 600 | 1 | `--fg` |
| Sous-titre (`h3` : Stack, Certifications, Soft Skills…) | Cormorant italique | 28 px | 500 | | `--accent` |
| Libellé de ligne de stack (`h4`) | Cormorant | 22 px | 600 | | `--fg` |
| Titre de certification | Cormorant | 27 px | 600 | 1.15 | `--fg` |
| Titre de projet | Cormorant | 30 px | 600 | 1.1 | `--fg` |
| Accroche d'About | Plex Sans, comme les paragraphes (17 octobre 2026) | 28 px | 400 | 1.25 | `--fg` |
| Paragraphe courant (About, Contact) | Plex Sans | 17 px | `--w-body` | 1.6 | `--muted` |
| Résumés de projet | Plex Sans | 14 px | `--w-body` | 1.5 | `--muted` |
| Liens de navigation | Plex Sans | 15 px | 400 | | `--fg` |
| Nom dans la navigation | Cormorant | 22 px | 600 | | `--fg` |

### 5.3 Espacements et formes

- Marge horizontale de page : `6%` de chaque côté.
- Largeur maximale du contenu : 1440 px centré **[PROPOSÉ]** (les maquettes s'arrêtent à 1440 px, rien n'est dessiné au-delà).
- Arrondis : `2px` (cards, champs, boutons rectangulaires), `999px` (pastilles), `50%` (boutons ronds).
- Zone cliquable minimale : 44 × 44 px (48 × 48 px pour les icônes du hero).
- Focus clavier : `outline: 2px solid var(--accent); outline-offset: 3px` sur liens, boutons, champs.

### 5.4 Halos décoratifs (`BlurDecor`)

Cercles flous en position absolue, `border-radius: 50%`, `filter: blur(70px)`, `pointer-events: none`, `aria-hidden="true"`. La section parente est en `position: relative; overflow: hidden`.

| Section | Position | Taille | Couleur | Opacité sombre | Opacité claire |
|---|---|---|---|---|---|
| Hero | droite -80, haut -110 | 460 | `#d4a574` | .26 | .55 |
| Hero | droite 160, haut 70 | 300 | `#e8b4b8` | .22 | .6 |
| Hero | gauche -130, bas -150 | 400 | `#c9b896` | .24 | .6 |
| Skills | droite -130, bas -140 | 360 | `#e8b4b8` | .2 | .55 |
| Projects | gauche -150, haut -130 | 380 | `#d4a574` | .2 | .5 |
| About | droite -120, haut -120 | 360 | `#e8b4b8` | .2 | .55 |
| Contact | gauche -140, bas -120 | 400 | `#d4a574` | .22 | .55 |
| Contact | droite -110, haut 120 | 300 | `#c9b896` | .18 | .5 |
| /projects | droite -110, haut -130 | 420 | `#d4a574` | .24 | .55 |
| /projects | gauche -140, bas -140 | 380 | `#e8b4b8` | .18 | .55 |

### 5.5 Composants d'interface

**Pill (pastille de compétence)** : `inline-flex`, hauteur 36 px, `padding: 0 14px`, `gap: 8px`, bordure `1px solid var(--gold)`, arrondi 999 px, texte 14 px graisse 400, marge `0 10px 10px 0`. Icône optionnelle 18 × 18 px devant le texte. Variante `dashed` (bordure en pointillés) pour la ligne « Learning ». Couleurs (T15, tokens `--pill-*` de 5.1) : un état clair et un état sombre qui s'échangent au survol, en 200 ms, la bordure dorée restant visible dans les deux. Thème clair : blanc avec logo doré au repos, noir avec logo blanc au survol. Thème sombre : l'inverse, noir avec logo blanc au repos, blanc cassé avec logo doré au survol (échange inversé le 16 octobre 2026). Survol réservé aux appareils avec une souris (`hover: hover`).

**Pill petite (techno d'un projet)** : même forme, hauteur 28 px, `padding: 0 12px`, texte 13 px, sans icône.

**Tag (étiquette)** : hauteur 28 px, `padding: 0 12px`, texte 13 px, arrondi 2 px (rectangle, décidé à T15), bordure et texte `--rose`. Variante `dashed` pour « In progress ». Survol (souris seulement) : couleurs inversées en 200 ms, fond `--rose`, texte `--bg`.

**IconLink (bouton rond)** : 44 × 44 px (navigation) ou 48 × 48 px (hero), bordure `1px solid var(--control)`, fond plein `--bg` (le champ de code du hero ne doit pas apparaître à travers, T22), arrondi 50 %, icône 20 × 20 px centrée, `aria-label` obligatoire. Lien externe avec `href`, bouton avec `onClick`.

**ArrowLink (« View GitHub repo »)** : `inline-flex`, `gap: 8px`, hauteur minimale 44 px, texte 14 px graisse 500 `--accent`, souligné (`text-underline-offset: 4px`). Icône GitHub 16 px devant, flèche diagonale 16 px derrière (`path d="M7 17 17 7M9 7h8v8"`, trait 1.8).

**Icônes de techno** : dans les maquettes ce sont des images pré-teintées, une par thème. Dans le code : un seul SVG par techno en `fill="currentColor"`, coloré par `color: var(--icon)`. Source : paquet npm `simple-icons`.

## 6. Structure des pages

### 6.1 Navigation (`Navbar`) — commune aux deux pages

- `position: sticky; top: 0; z-index: 20`, hauteur minimale 72 px, `padding: 8px 6%`, fond `--bg`, bordure basse `1px solid var(--line)`.
- Gauche : « Yoan Cuervo », lien vers le haut de l'accueil. Le monogramme qui le précédait a été retiré le 20 octobre 2026 ; il reste la favicon.
- Droite, espacés de 28 px : Skills, Projects, About, Contact, puis deux boutons ronds espacés de 8 px.
- **Lien actif** : souligné (`text-underline-offset: 6px`), transition 150 ms. Sur l'accueil, c'est la section visible (`useActiveSection`). Sur `/projects`, c'est « Projects ».
- **Bouton thème** : en sombre il montre un soleil (`aria-label="Switch to light theme"`), en clair une lune (`aria-label="Switch to dark theme"`).
- **Bouton langue** : il affiche le drapeau de la langue **vers laquelle on bascule**. Site en anglais : drapeau français, `aria-label="Switch the site to French"`. Site en français : drapeau britannique, `aria-label="Passer le site en anglais"`. Drapeau en 24 × 16 px, `alt=""`.
- `aria-label` de la balise `nav` : « Main navigation » / « Navigation principale ».

### 6.2 Hero (`#home`)

- Hauteur : `min-height: calc(100svh - 72px)` (828 px sur la maquette de 900 px), contenu centré verticalement et horizontalement, `padding: 32px 6%`.
- Une colonne centrée de `max-width: 800px`, dont le contenu est **aligné à gauche**, `gap: 22px`.
- Dans l'ordre :
  1. `h1` « Yoan Cuervo », fixe (pas d'animation, décidé à T15). Une `span` par lettre, en `aria-hidden="true"`, avec `aria-label="Yoan Cuervo"` sur le `h1` : la dernière lettre porte `data-lens-anchor`, où se pose la lentille du champ de code (T22).
  2. Un bloc décalé de `padding-left: 40px` qui contient :
     - « Web Developer » (voir typographie), seul élément animé du hero : composant `AnimatedRole`, texte complet masqué visuellement pour les lecteurs d'écran et une lettre par `span` en `aria-hidden` pour l'animation (voir 7) ;
     - un groupe avec filet vertical : `margin-left: -32px; padding: 6px 0 6px 30px; border-left: 2px solid var(--gold)`, `gap: 22px`, qui contient :
       - quatre boutons ronds de 48 px espacés de 12 px : GitHub, LinkedIn, Discord (liens externes), enveloppe (défile vers Contact, `aria-label="Email me, go to the contact form"`). Au survol (souris) et au focus clavier (`:focus-visible`, le contour `--accent` restant visible), les quatre inversent leurs couleurs dans les deux thèmes : fond `--fg`, icône `--bg`, bordure `--fg`, 200 ms, sans transition en mouvement réduit (20 octobre 2026). Les autres `IconLink` (navigation, carrousel) ne changent pas ;
       - trois paragraphes, `max-width: 760px`, `gap: 10px`.

Textes (anglais, validés) :

> Hello there!
> I am a problem solver passionate about building thoughtful, engaging digital experiences.

> Before moving into web development, I worked as a 1st AD in audiovisual industry, where I gained strong skills in project coordination, teamwork, and problem-solving. Today, I apply that same mindset to development, combining creative thinking with technology to turn ideas into functional experiences.

> I'm constantly striving to improve my skills and design principles. I'm always eager to learn, collaborate, and contribute to projects that combine conceptual thinking with new technology.

Le premier paragraphe a un retour à la ligne après « Hello there! ».

**Champ de code (`CodeField`, T22)** — ajouté le 15 octobre 2026, inspiré du fond de Claude Code, réglé à l'écran avec Yoan. Toutes les valeurs sont des constantes en haut de `CodeField.tsx`.

*Le champ au repos*

- Un `<canvas>` dans une `div` en `aria-hidden="true"` et `pointer-events: none` couvre tout le hero, au-dessus des halos et sous le contenu.
- Lignes de caractères en `--font-mono`, 11 px, une ligne tous les 16 px. Caractères tirés au hasard dans `data/codeGlyphs.ts` : `A–Z a–z 0–9 / + = . ; ~` (aspect de jetons, d'empreintes, de données encodées).
- Chaque ligne glisse vers la gauche à sa propre vitesse, entre 20 et 40 px/s.
- Chaque ligne est découpée en tronçons de 3 à 20 caractères : invisibles (25 %), pâles (60 %, `--code` à 0,035), plus marqués (15 %, × 2,2). Toutes les opacités sont multipliées par `--code-intensity`.

*La lentille (trou noir)*

- Lentille gravitationnelle : un point du fond à la distance d du centre est vu à (d + √(d² + 4E²)) / 2 (première image, repoussée vers l'extérieur : les lignes s'arquent au-dessus et en dessous du trou, comme le disque d'Interstellar) et, retourné, à (√(d² + 4E²) − d) / 2 (seconde image, en arcs serrés contre l'ombre). E = 34 px.
- Ombre opaque de 24 px de rayon (48 px de diamètre, comme les ronds du hero), couleur `--hole`, avec un fin anneau `--lens` à 0,18.
- Effet plein jusqu'à mi-rayon, puis fondu jusqu'à 180 px. Caractères orientés le long de la courbe, étirés le long du cercle (jusqu'à × 3), éclaircis jusqu'à 0,22 en `--lens` près du trou ; seconde image à 60 %.
- La lentille suit la souris de près (90 % de l'écart rattrapé à chaque image).
- Souris hors du hero (et au chargement) : la lentille se pose sur la dernière lettre du nom (le « o » de « Cuervo », marqué `data-lens-anchor` dans `AnimatedName`), un peu sous le milieu de sa boîte (centre optique). Retour en 1,4 s, départ et arrivée en douceur (ease-in-out), même durée sur tous les écrans.

*Accessibilité et performance*

- Tactile : pas de suivi, la lentille reste posée sur le « o ».
- `prefers-reduced-motion: reduce` : ni défilement ni lentille ; à la place, un révélateur simple (dégradé circulaire jusqu'à 0,35 autour du curseur).
- Animation suspendue quand le hero sort de l'écran (IntersectionObserver) ; taille du canvas suivie par un ResizeObserver (le hero change de taille sans que la fenêtre bouge, par exemple au changement de langue). Un changement de thème remonte le composant (`key={theme}`) pour relire les couleurs.
- Performance : chaque ligne est dessinée une fois dans une image hors écran puis recopiée ; la lentille recopie chaque caractère depuis une planche de glyphes (`drawImage` + `setTransform`, opacité par `globalAlpha`) ; couleurs lues une seule fois ; caractères quasi invisibles sautés. Environ 2,4 ms par image avec la lentille, 1,4 ms sans (mesuré à 1024 × 768).

### 6.3 Skills (`#skills`)

- `min-height: 100svh`, contenu centré verticalement, sans espace en haut (17 octobre 2026), `gap: 36px`, `padding: 0 6% 48px`.
- `h2` « Skills », puis deux colonnes en `flex-wrap` avec `gap: 48px 72px` :
  - **Stack** (`flex: 2 1 560px`) : cinq lignes. Chaque ligne : `border-top: 1px solid var(--line)`, `padding-top: 14px`, un libellé de 140 px de large à gauche et les pastilles à droite (`flex: 1 1 320px`).
  - **Certifications** (`flex: 1 1 340px`) : deux blocs, chacun `border-top: 1px solid var(--line)`, `padding: 18px 0 10px`, `gap: 8px` : titre, détail (15 px, `--muted`), étiquette.

Données de la stack :

| Ligne | Pastilles (dans cet ordre) |
|---|---|
| Languages | JavaScript, TypeScript |
| Frontend | React, Next.js, HTML5, CSS3 |
| Backend | Node.js, Express.js, MySQL, REST API (sans icône) |
| Tools | Git, GitHub, Docker, Biome, Figma |
| Learning (pointillés) | Python, CI/CD, MLOps, LLM, RAG, Agentic AI (seul Python a une icône) |

Certifications :

| Titre | Détail | Étiquette |
|---|---|---|
| Web and Mobile Developer | RNCP-37674 certification, level 5 | « Earned in 2026 » (trait plein) |
| Artificial Intelligence Developer | RNCP-37827 certification, level 6. Wild Code School, Paris. | « In progress, 2026-2028 » (pointillés) |

### 6.4 Projects (`#projects`)

- `min-height: calc(100svh - var(--nav-height))` : la section tient dans l'écran sous la `Navbar`, lien « View all projects » compris (T19). `gap: 22px`, `padding: 48px 6% 40px`.
- `h2` « Projects », trois `FeaturedProjectCard` (les projets `featured`) dans une grille `repeat(auto-fit, minmax(320px, 1fr))`, `gap: 24px`, qui prend toute la hauteur restante, puis le lien « View all projects » **calé à droite** (Cormorant italique 500, 24 px, `--accent`) vers `/projects`.
- Les `ProjectRow` décrites plus bas ne servent plus que sur `/projects` (6.7).

**`FeaturedProjectCard`** (T19, 19 octobre 2026, d'après la maquette de Yoan) : `article`, fond `--card`, bordure `1px solid var(--line)`. Les polices, tailles et couleurs sont celles de `ProjectRow` et `ProjectCard` ; seule la disposition change.

- La capture couvre **toute la carte** et reste entièrement visible. Derrière le texte, un voile translucide `--scrim` (noir à 78 % en thème sombre, blanc à 65 % en thème clair), qui démarre en fondu 80 px au-dessus du texte, garde celui-ci lisible. Le 20 octobre 2026, le blanc est passé de 78 % à 65 % : à 78 % il rendait les photos sombres laiteuses, à 50 % le texte devenait illisible. Un voile « givré » (`backdrop-filter: blur`) a été essayé et écarté le même jour. Tant qu'elle manque : la zone en pointillés « Project screenshot » sur toute la carte, libellé dans le haut.
- En haut à droite : l'étiquette « Team Project » ou « Solo Project » (`Tag`), sur un fond `--card` pour rester lisible sur la capture.
- Le texte est calé en bas de la carte, de haut en bas : titre du projet (`h3`) et type ; « The project » et « How it was built » (`h4`) côte à côte, séparés par un filet vertical `--line` ; les pastilles de techno, centrées. Le lien GitHub (`ArrowLink`, sans fond, libellé court « GitHub » suivi du nom du projet en texte masqué pour les lecteurs d'écran) est dans le coin bas droit, symétrique de l'étiquette (centres à 28 px des bords).

- Lien vers le site en ligne : porté par le titre, dont le pseudo-élément `::after` couvre toute la carte (le lien GitHub passe au-dessus avec `z-index`). Un `<a>` ne peut pas en contenir un autre, d'où ce choix. Le contour de focus est reporté sur la carte entière (`:has(:focus-visible)`).
- Clavier : chaque carte est une étape du Tab (le lien du titre, ou la carte elle-même en `tabIndex={0}` sans site en ligne), suivie de son lien GitHub.
- Survol (souris seulement, tout est coupé en mouvement réduit), 300 ms :
  - soulèvement, ombre, bordure `--control` et zoom de la capture si la carte est un lien, comme `ProjectCard` (voir plus bas) ;
  - lueur qui suit le contour de la carte : seconde ombre `0 0 40px`, sans décalage, `--halo-amber` à 35 % en thème sombre, `--halo-rose` à 60 % en thème clair (à 35 %, elle était presque invisible sur le fond clair). Elle n'apparaît que sur la carte survolée ; un halo commun qui glissait de carte en carte a été essayé et écarté (19 octobre 2026) ;
  - les deux autres cartes reculent : `opacity: 0.6`, `scale: 0.98`. Même effet quand le focus clavier entre dans une carte (`:focus-within`) ;
  - le voile `--scrim` s'allège (`opacity: 0.87` sur le voile, soit environ 68 %) pour laisser voir davantage la capture ;
  - une lumière qui suivait le curseur (dégradé radial `--accent`) a été essayée et retirée le 20 octobre 2026.

**`ProjectRow`** (`article`, `flex-wrap`, `gap: 18px 40px`, `padding-top: 20px`, `border-top: 1px solid var(--line)`) :

1. **`ProjectCard`** à gauche, `flex: 0 1 350px`. C'est **un lien entier vers le site en ligne** (nouvel onglet, `rel="noopener noreferrer"`). `display: flex; gap: 18px; padding: 14px`, fond `--card`, bordure `1px solid var(--line)`. Contient :
   - la capture d'écran, `flex: 0 0 150px`, hauteur minimale 124 px (tant qu'elle manque : zone en pointillés `1px dashed var(--control)` avec le texte « Project screenshot ») ;
   - le titre du projet et son type (14 px, `--muted`).
   - Il n'y a **pas** de libellé « View site » : il a été retiré.
   - Survol (T15, souris seulement, coupé en mouvement réduit) : la card se soulève, `translateY(-4px) scale(1.02)`, ombre `0 18px 40px -18px var(--shadow)`, bordure `--control`, 300 ms `cubic-bezier(.2,.7,.2,1)`. Si la card est un lien, la capture zoome en plus à `scale(1.03)` en 200 ms, rognée par son cadre.
   - Si le projet n'a pas de site en ligne : **[PROPOSÉ]** la card est rendue en `div`, sans lien ni effet de survol, mais atteignable au clavier (`tabIndex={0}`, focus visible) : à la demande de Yoan (T17), chaque card reste une étape du parcours au Tab.
2. **Colonne de droite**, `flex: 1 1 520px`, `gap: 12px` :
   - petites pastilles de techno, puis l'étiquette « Team Project » ou « Solo Project » ;
   - deux blocs côte à côte (`flex: 1 1 240px`, `gap: 10px 40px`) :
     - « The project » : résumé, puis **sous le résumé** le lien « View GitHub repo » (`ArrowLink`) ;
     - « How it was built » : résumé.
   - Titres de ces blocs : 14 px, graisse 500, `--fg`.

Contenu :

| | Wedoo | Poke_Gacha | Projet 3 |
|---|---|---|---|
| Type | Web app | Web game, in progress | [À FOURNIR] |
| Technos | React, TypeScript, Node.js, Express, MySQL | React, TypeScript, Express, MySQL | [À FOURNIR] |
| Étiquette | Team Project | Solo Project | [À FOURNIR] |
| The project | Web app for creating and managing events, presented for the Web and Mobile Developer certification. | Pokémon collection web game: players, collection, teams, items and evolutions. | [À FOURNIR] |
| How it was built | I built the whole reporting system, from the user form to the admin review, on both the front end and the back end. | Database designed as a Merise conceptual model, then a MySQL schema with integrity constraints. Express API and React interface, in TypeScript. | [À FOURNIR] |
| Site en ligne | [À FOURNIR] | [À FOURNIR] | [À FOURNIR] |
| Dépôt GitHub | [À FOURNIR] | [À FOURNIR] | [À FOURNIR] |
| Capture | [À FOURNIR] | [À FOURNIR] | [À FOURNIR] |

### 6.5 About (`#about`)

- `min-height: 100svh`, `gap: 40px`, `padding: 56px 6% 48px`. Le carrousel respecte les mêmes marges que le texte (17 octobre 2026) : ses bords fondus se font à l'intérieur.
- `h2` « About me », puis deux colonnes (`gap: 32px 72px`) :
  - gauche (`flex: 3 1 480px`, `gap: 18px`) : accroche, puis un bloc sans espace entre ses paragraphes (17 octobre 2026) : trois paragraphes et une phrase de conclusion dont la fin est en `strong` (IBM Plex Sans 500, couleur `--fg` comme les titres), tous en `max-width: 40em` ;
  - droite (`flex: 2 1 340px`, `gap: 14px`) : `h3` « Soft Skills » et dix pastilles sans icône. La citation « Imagination rules the world. » a été retirée le 17 octobre 2026.
- Puis, 64 px plus bas (écart de section de 40 px + `margin-top: 24px`), une ligne avec `h3` « Productions & collaborations that trusted me » à gauche et le bouton pause à droite, puis le carrousel (17 octobre 2026).

Textes (17 octobre 2026 : français écrit par Yoan, anglais traduit par Claude, à valider) :

> After ten years in the audiovisual industry as an assistant director, I traded my call sheets for code.

> There I learned to turn a vision into reality, to coordinate teams with diverse expertise and to carry ambitious projects through to completion.
>
> Today I apply the same logic to web development: understanding a need, designing a solution and solving problems to bring functional, accessible applications to life.
>
> Alongside this, I am deepening my skills in artificial intelligence, eager to bring its possibilities into the development of useful, relevant applications.
>
> What drives me hasn't changed: **bringing ideas to life.**

Soft skills, dans cet ordre : Adaptability, Prioritization, Autonomy, User understanding, Analytical thinking, Fast learner, Initiative, Product collaboration, Agile methods (Scrum), Debugging. Sur un écran de 1920 px, cet ordre donne deux lignes de quatre puis Agile et Debugging seuls, dans les deux langues. Plus étroit, le retour à la ligne change.

**Carrousel (`Marquee`)** : deux rangées espacées de 14 px, défilement continu en sens alternés (T23, 17 octobre 2026 : liste tirée du profil LinkedIn de Yoan, diffuseurs, productions, agences et marques mélangés). Une rangée doit être plus large que l'écran, sinon la boucle laisse un vide : 10 tuiles de 176 px (marge comprise) couvrent les 1 690 px du carrousel sur un écran de 1920 px, marges de 6 % déduites.

- Rangée 1, vers la droite : Canal+, Adidas, Publicis, TF1, Microsoft, Iconoclast, Lego, Norma, France Télévisions, BETC (remplace Blue Paris, 17 octobre 2026).
- Rangée 2, vers la gauche : Eurosport, Buzzman, Lidl, Sony Pictures, Quad, Le Coq Sportif, La Banque Postale, When We Were Kids, Volvic, Société Générale. Ponk et Lenthal retirés par Yoan le 17 octobre 2026.
- **[À FOURNIR]** : liste définitive par Yoan, orthographe de « Norma » à confirmer.
- Tuile (`ClientTile`) : 160 × 88 px, `padding: 0 16px`, `margin-right: 16px`, fond `--tile-bg`, bordure `1px solid var(--tile-border)`, arrondi 2 px. Logo seul, sans nom affiché, dans une case de 120 × 56 px. Les tuiles sont claires dans les deux thèmes : les logos, en couleurs d'origine, y gardent la même taille (la plaque claire du thème sombre a été retirée le 17 octobre 2026). Tant qu'un logo manque, la tuile affiche le nom en Cormorant 600, 18 px, couleur `--tile-fg`. En thème sombre, la tuile est blanche (`--fg`) et le texte noir (17 octobre 2026).
- Survol d'une tuile : le logo, toujours en couleurs d'origine et à pleine opacité, grossit à 1,04 (250 ms). Une infobulle donne le nom : fond `--fg`, texte `--bg`, IBM Plex Sans 500, 13 px, `padding: 6px 10px`, arrondi 4 px, fondu de 200 ms. Elle sort du côté extérieur de la rangée (au-dessus de la rangée 1, en dessous de la rangée 2) pour ne jamais couvrir l'autre. Le conteneur, qui coupe ce qui dépasse, est agrandi de 44 px de ce côté (marge négative pour ne rien décaler) et laisse passer les clics hors des tuiles. Le nom reste lu par les lecteurs d'écran, le logo a un `alt` vide.
- Technique : chaque rangée contient la liste **deux fois** (la seconde copie en `aria-hidden="true"`), `width: max-content; white-space: nowrap`, animation de `translateX(-50%)` à `0` (rangées impaires) ou de `0` à `-50%` (rangées paires), 40 s, linéaire, infinie.
- Bords fondus : `mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)` sur le conteneur.
- Pause au survol. Arrêt complet si `prefers-reduced-motion: reduce`.
- Bouton pause / lecture (T17, WCAG 2.2.2 : le survol ne couvre ni le clavier ni le tactile) : `IconLink` rond de 44 px aligné à droite sur la ligne du titre, au-dessus des rangées (17 octobre 2026), qui les arrête ou les relance toutes à la fois. Son `aria-label` change avec l'état (« Pause the logo carousel » / « Play the logo carousel »). Masqué en mouvement réduit, où le carrousel est déjà à l'arrêt. Absent des maquettes, validé par Yoan le 16 octobre 2026.

### 6.6 Contact (`#contact`) et pied de page

- `min-height: 100svh`, colonne centrée, `padding: 48px 6% 0`. Le pied de page est **dans** cette section, collé en bas : contact + pied de page tiennent ensemble dans un écran.
- Bloc central (`gap: 22px`, centré verticalement dans l'espace restant) :
  - `h2` centré : « What's on your mind? » en graisse 600, suivi de « Let's talk about it. » en graisse **normale** (400), sur la même ligne, 60 px.
  - Paragraphe centré : « Describe it in a few lines and I'll reply by email. » (17 px, `max-width: 34em`).
  - Formulaire, `max-width: 620px`, `gap: 18px` :
    - un **cadre** qui contient les trois champs : `padding: 28px`, fond `--form-bg`, bordure `1px solid var(--line)`, arrondi 2 px, `gap: 18px` ;
    - le bouton d'envoi **hors du cadre**, centré dessous.
- Champs (libellé au-dessus, 14 px graisse 500, `gap: 6px`) :

| Libellé | Balise | Attributs |
|---|---|---|
| Name | `input type="text"` | `name="name"`, `autocomplete="name"`, requis |
| Email address | `input type="email"` | `name="email"`, `autocomplete="email"`, requis |
| Project description | `textarea rows="6"` | `name="message"`, requis, `resize: vertical` |

- Style des champs : hauteur 48 px (`input`), `padding: 0 14px` (`textarea` : `12px 14px`, interligne 1.5), fond `--form-bg`, bordure `1px solid var(--control)`, arrondi 2 px, texte 16 px `--fg`.
- Bouton « Send my request » : hauteur 48 px, `padding: 0 32px`, sans bordure, arrondi 2 px, fond `--btn-bg`, texte `--btn-fg`, 15 px graisse 500.
- **Pied de page** : `border-top: 1px solid var(--line)`, `padding: 18px 0`, 14 px, `--muted`, aligné à droite (T17 : à gauche, les halos flous passent derrière le texte et Lighthouse y mesure un contraste insuffisant). Texte unique : « © 2026 Yoan Cuervo » (année calculée avec `new Date().getFullYear()`). La mention « Designed and built by me » a été retirée.

États du formulaire (comportement défini dans les notes de maquette, textes **[PROPOSÉ]**) :

| État | Comportement | Texte EN | Texte FR |
|---|---|---|---|
| Champ actif | Bordure `--accent`, transition 150 ms | | |
| Champ vide à l'envoi | Message sous le champ, relié par `aria-describedby`, `aria-invalid="true"` | This field is required. | Ce champ est obligatoire. |
| E-mail invalide | idem | Enter a valid email address. | Saisissez une adresse e-mail valide. |
| Envoi | Bouton désactivé, texte changé | Sending… | Envoi en cours… |
| Succès | Un message **remplace** le formulaire, annoncé par `role="status"` | Message sent. I'll get back to you by email. | Message envoyé. Je vous réponds par e-mail. |
| Échec réseau | Message au-dessus du bouton, `role="alert"`, le contenu saisi est conservé | Sending failed. Try again in a moment. | L'envoi a échoué. Réessayez dans un instant. |

Envoi (T13) : `fetch` en `POST` vers `https://api.web3forms.com/submit`, corps JSON `{ access_key, name, email, message, botcheck }`. La clé est dans `VITE_WEB3FORMS_KEY` : `.env.local` en local (ignoré par git), variable du dépôt GitHub pour la mise en ligne. Elle est publique par nature (visible dans le code livré) ; l'adresse mail de Yoan reste configurée côté service et n'apparaît jamais dans le dépôt.

- Validation à l'envoi (`noValidate`, messages traduits) ; focus sur le premier champ en erreur ; une erreur disparaît dès que le champ est corrigé. Messages d'erreur et d'échec en `--rose`.
- Champ leurre : case `botcheck` hors écran, `tabIndex={-1}`, `aria-hidden`. Cochée, rien n'est envoyé mais la confirmation s'affiche (le robot ne sait pas qu'il est repéré).
- Succès : la zone `role="status"` est toujours présente (pour être annoncée) et reçoit le focus quand le formulaire disparaît.
- Sans clé (par exemple en local sans `.env.local`), l'envoi échoue proprement.

### 6.7 Page `/projects` (`ProjectsPage`)

- Même `Navbar` (« Projects » souligné), page en colonne `min-height: 100svh`.
- `main` : `padding: 40px 6% 56px`, `gap: 22px` :
  1. lien « Back » (« Retour » en français, raccourci le 20 octobre 2026) avec flèche vers la gauche (15 px, `--accent`, hauteur minimale 44 px). Il ramène sur la section Projects de l'accueil, pas en haut (20 octobre 2026). Le bouton retour du navigateur fait de même : au clic sur « View all projects », la section est enregistrée dans l'entrée d'historique courante (`replace`), et `HomePage` la lit au retour. Le saut est instantané et fait avant l'affichage (`useLayoutEffect`, `behavior: "instant"`) : la page s'ouvre directement sur la section, sans passer par le haut ;
  2. `h1` « All projects » (76 px) ;
  3. **tous** les projets en `ProjectRow`, même composant que sur l'accueil. La maquette en montre cinq : Wedoo, Poke_Gacha, et trois emplacements vides.
- Niveaux de titres décalés d'un cran : titre de projet en `h2`, « The project » et « How it was built » en `h3` (sur l'accueil : `h3` et `h4`). `ProjectRow` reçoit donc une prop `headingLevel`.
- Pied de page identique, avec `margin: 0 6%`.

## 7. Animations

Règles communes : aucune animation au-delà de 500 ms sauf le carrousel ; les animations d'entrée se jouent une fois au défilement, et à nouveau à chaque navigation volontaire par la `Navbar` vers la section concernée (décidé après T15) ; avec `prefers-reduced-motion: reduce`, tout est coupé et le carrousel reste à l'arrêt. Les animations d'entrée utilisent `--ease-out-slow: cubic-bezier(0, 0, 0.3, 1)` (`tokens.css`) : départ vif, long freinage, effet « pop » inspiré de mustsociete.com (16 octobre 2026).

| Zone | Déclencheur | Effet |
|---|---|---|
| Hero, rôle (« Web Developer ») | Chargement de la page | Chaque lettre monte depuis `translateY(115%)`, 500 ms, `cubic-bezier(.2,.7,.2,1)`, décalage de 40 ms par lettre (l'espace compte pour un cran). En place en moins de 1,1 s. Le nom et le reste du hero sont affichés d'emblée, sans animation (décidé à T15). |
| Skills | Entrée dans l'écran | Lignes de la stack puis blocs de certification, dans la même cascade : montée de 24 px en fondu, 500 ms, `--ease-out-slow`, décalage de 75 ms |
| Pastille, étiquette | Survol | Échange des états clair et sombre (pastille) ou remplissage `--rose` (étiquette), 200 ms (voir 5.5) |
| Projects, accueil | Entrée dans l'écran | En éventail (T19) : la carte du milieu monte de 32 px en fondu, puis 100 ms plus tard les deux autres arrivent depuis le centre (décalage horizontal de 60 px en plus de la montée). 500 ms par carte, `--ease-out-slow` |
| Projects, `/projects` | Entrée dans l'écran | Chaque rangée monte de 32 px en fondu quand elle entre à l'écran, 500 ms, `--ease-out-slow`, décalage de 75 ms. Une version liée au défilement (`animation-timeline: view()`, façon apple.com) a été essayée le 16 octobre 2026 et écartée : l'effet ne se voyait pas sur des rangées |
| Card projet | Survol | Soulèvement et ombre, 300 ms ; zoom de la capture si la card est un lien (voir 6.4) |
| Carte projet de l'accueil | Survol | En plus : lueur au contour, recul des deux autres cartes, voile allégé (voir 6.4) |
| About, texte | Entrée dans l'écran | Montée de 24 px en fondu, 500 ms, `--ease-out-slow` |
| Contact | Entrée dans l'écran | Titre, introduction puis formulaire : montée de 24 px en fondu, 500 ms, `--ease-out-slow`, décalage de 75 ms (16 octobre 2026 : Contact suit le reste de la page) |
| Carrousel | Permanent | Voir 6.5 |
| Hero, champ de code | Permanent + survol | Lignes qui glissent vers la gauche ; lentille gravitationnelle qui suit le curseur, retour en 1,4 s sur le « o » de « Cuervo ». Voir 6.2 (T22) |
| Navigation | Changement de section | Soulignement du lien actif, 150 ms |
| Thème | Clic | Transition des couleurs 200 ms |
| Champ de formulaire | Focus | Bordure accentuée, 150 ms |

Implémentation : un hook `useReveal(sectionId)` (IntersectionObserver, seuil 20 %, se déconnecte après le premier déclenchement) qui pose une classe ; à l'événement `section-navigate` de sa section, il retire la classe et observe à nouveau, pour rejouer l'animation à l'arrivée (le rôle du hero l'utilise aussi, avec `home`) ; les décalages passent par une variable CSS `--i` et `animation-delay: calc(var(--i) * 75ms)` (Contact : `:nth-child`). L'état masqué avant l'apparition n'est déclaré que sous `prefers-reduced-motion: no-preference`, pour que tout reste visible en mouvement réduit. Les CSS Modules renomment toujours les noms d'animation (et `:global` y casse le build) : chaque module déclare ses propres `@keyframes`, il n'y a pas de fichier de keyframes partagées.

## 8. Thème et langue

**Thème**

- Attribut `data-theme="dark" | "light"` sur `<html>`.
- Mémorisé dans `localStorage` (clé `theme`), lecture et écriture dans un `try/catch`.
- Première visite : préférence du système (`prefers-color-scheme`), sombre par défaut **[PROPOSÉ]**.
- Un petit script en ligne dans `index.html` pose `data-theme` **avant** le chargement de React, pour éviter un flash de mauvais thème.

**Langue**

- `LanguageContext` expose `{ lang, t, toggleLang }`. `t` est l'objet de textes de la langue courante (`t.nav.skills`), pas une fonction à clés en chaîne : l'autocomplétion et le typage font le contrôle.
- `fr.ts` est typé `typeof en` : une clé manquante casse la compilation.
- Mémorisée dans `localStorage` (clé `lang`). Première visite : français si `navigator.language` commence par `fr`, sinon anglais **[PROPOSÉ]**.
- L'attribut `lang` de `<html>` et le `<title>` suivent la langue.
- Les fichiers `data/*.ts` ne contiennent que ce qui ne se traduit pas (identifiants, technos, URL, images). Tous les textes sont dans `locales/`, rangés par identifiant.

Exemple de découpage :

```ts
// data/projects.ts
export type Project = {
  id: 'wedoo' | 'pokeGacha' | 'project3';
  title: string;                 // nom propre, non traduit
  stack: string[];
  team: 'team' | 'solo';
  liveUrl: string | null;
  repoUrl: string | null;
  screenshot: string | null;     // import d'image
  featured: boolean;             // true = affiché sur l'accueil (3 maximum)
};

// locales/en.ts (extrait)
export const en = {
  nav: { skills: 'Skills', projects: 'Projects', about: 'About', contact: 'Contact' },
  projects: {
    title: 'Projects',
    viewAll: 'View all projects',
    theProject: 'The project',
    howBuilt: 'How it was built',
    viewRepo: 'View GitHub repo',
    repoShort: 'GitHub', // home page cards (T19)
    team: { team: 'Team Project', solo: 'Solo Project' },
    items: {
      wedoo: { type: 'Web app', summary: '…', build: '…' },
      pokeGacha: { type: 'Web game, in progress', summary: '…', build: '…' },
    },
  },
};
```

### Textes français

Textes d'origine des maquettes avant leur passage en anglais (validés à l'époque) :

| Clé | Français |
|---|---|
| Navigation | Compétences, Projets, À propos, Contact |
| Stack | Langages, Frontend, Backend, Outils, Apprentissage |
| Pastilles traduites | API REST, IA agentique |
| Certification 1 | Développeur web et web mobile · Titre RNCP-37674, niveau 5 · Obtenu en 2026 |
| Certification 2 | Développeur en intelligence artificielle · Titre RNCP-37827, niveau 6. Wild Code School, Paris. · En préparation, 2026-2028 |
| Projets | Projets · Voir tous les projets · Le projet · Sa construction · Voir le dépôt GitHub · Capture d'écran du projet |
| Types | Application web · Jeu web, en cours |
| Wedoo, le projet | Application web de gestion et de création d'événements, présentée pour le titre de développeur web et web mobile. |
| Wedoo, sa construction | J'ai développé tout le système de signalement, du formulaire utilisateur au traitement par l'administrateur, côté front et back. |
| Poke_Gacha, le projet | Jeu web de collection Pokémon : joueurs, collection, équipes, objets et évolutions. |
| Poke_Gacha, sa construction | Base conçue en MCD Merise, puis schéma MySQL avec contraintes d'intégrité. API Express et interface React, en TypeScript. |
| About, accroche | Après dix années dans l'audiovisuel comme assistant réalisateur, (retour à la ligne) j'ai troqué mes feuilles de service contre du code. |
| About, paragraphes | J'y ai appris à transformer une vision en réalité, à coordonner des équipes aux expertises variées et à mener des projets ambitieux jusqu'à leur aboutissement. / Aujourd'hui, j'applique cette même logique au développement web : comprendre un besoin, concevoir une solution et résoudre les problèmes pour donner naissance à des applications fonctionnelles et accessibles. / En parallèle, j'approfondis actuellement mes compétences en intelligence artificielle, avec l'envie d'intégrer ses possibilités au développement d'applications utiles et pertinentes. / Ce qui m'anime reste inchangé : **donner vie aux idées.** |
| Soft skills | Adaptabilité, Gestion des priorités, Autonomie, Compréhension des utilisateurs, Esprit analytique, Apprentissage rapide, Prise d'initiative, Collaboration produit, Méthodes agiles (Scrum), Debugging |
| Carrousel | Productions & collaborations qui m'ont fait confiance |
| Contact | Un projet en tête ? Parlons-en. · Décrivez-le en quelques lignes, je vous réponds par e-mail. · Nom · Adresse e-mail · Description du projet · Envoyer ma demande |
| /projects | Retour · Tous les projets |
| Libellés d'accessibilité | Navigation principale · Passer au thème clair · Passer au thème sombre · Passer le site en anglais · M'écrire, vers le formulaire de contact |

Textes français qui n'ont jamais existé **[PROPOSÉ]**, à valider :

| Clé | Proposition |
|---|---|
| Titre d'About | À propos de moi |
| Sous le nom | Développeur web (ou garder « Web Developer » dans les deux langues) |
| Étiquettes | Projet d'équipe · Projet solo |
| Titre « Soft Skills » | Soft Skills (inchangé, c'était déjà le choix en version française) |
| Hero, paragraphe 1 | Bonjour ! / J'aime résoudre des problèmes et construire des expériences numériques soignées et engageantes. |
| Hero, paragraphe 2 | Avant le développement web, j'ai été premier assistant réalisateur dans l'audiovisuel, où j'ai acquis de solides compétences en coordination de projet, en travail d'équipe et en résolution de problèmes. J'applique aujourd'hui le même état d'esprit au développement : associer créativité et technologie pour transformer des idées en expériences fonctionnelles. |
| Hero, paragraphe 3 | Je cherche en permanence à améliorer mes compétences et mes principes de conception. J'ai toujours envie d'apprendre, de collaborer et de contribuer à des projets qui associent réflexion et nouvelles technologies. |

## 9. Accessibilité (exigences, pas options)

- Structure : un seul `h1` par page, niveaux de titres sans saut, balises `header`, `nav`, `main`, `footer`, une `section` par partie avec `aria-labelledby`.
- Lien d'évitement « Skip to content » / « Aller au contenu » en premier élément focusable (validé à T17, absent des maquettes) : `SkipLink`, hors écran jusqu'au focus, puis en haut à gauche au-dessus de la `Navbar`, fond `--btn-bg`. C'est un `button` et non un lien : avec `HashRouter`, `href="#main"` changerait la route. Il donne le focus à `<main id="main" tabIndex={-1}>`.
- Tout est utilisable au clavier, focus toujours visible.
- Zones cliquables d'au moins 44 × 44 px.
- Icônes décoratives : `aria-hidden="true"` ou `alt=""`. Boutons sans texte : `aria-label` traduit.
- Liens externes : nouvel onglet avec `rel="noopener noreferrer"`, annoncé aux lecteurs d'écran (« (opens in a new tab) », clé `a11y.newTab`, dans un `span.visually-hidden` ou dans l'`aria-label`).
- Champs reliés à leur `label` par `for` / `id`, erreurs reliées par `aria-describedby`.
- `prefers-reduced-motion` respecté partout.
- Contrastes : les couleurs du thème clair ont été choisies plus sombres que leurs équivalents du thème sombre pour rester lisibles sur fond clair. Ne pas réutiliser `#d4a574`, `#e8b4b8` ou `#c9b896` pour du texte en thème clair.
- Les zones de texte doivent supporter l'allongement du français (environ 20 % de plus) sans casser la mise en page.

## 10. Responsive

Le bureau est maquetté en 1440 × 900 par section. La version mobile est maquettée depuis le 20 octobre 2026 : `docs/maquette-mobile/Main.dc.html` (page complète en 428 px), `Ecran.dc.html` (un écran de 428 × 926 avec la barre d'onglets) et leur note `specs-mobile-428.md`.

**La maquette mobile est un guide visuel, pas une source de contenu** (décision de Yoan, 20 octobre 2026). En cas d'écart (textes, ordre, couleurs, contenus, comportements), ce cahier fait foi. Ses fichiers sont ceux d'un outil de maquette : styles en ligne, balises `<sc-if>` et `<sc-for>`, ne rien en copier.

Décisions du 20 octobre 2026 :

- **Un seul point de rupture : `@media (max-width: 767px)`**. La note dit 428 px, mais les iPhone Pro Max et Plus font 430 px et la navigation bureau ne tient pas en dessous d'environ 900 px. Au-dessus de 767 px, le rendu bureau ne change pas.
- **Couleurs** : uniquement les tokens de 5.1, dans les deux thèmes. Les filets translucides de la maquette (opacité 0,08 et 0,10) deviennent `--line`, ses bordures translucides (0,18 à 0,28) `--control`. Le thème clair n'est pas dessiné : mêmes tokens que sur bureau, rendu à valider à l'écran.
- **Formes** : angles droits comme sur bureau (boutons, champs, blocs) ; les pastilles et les ronds gardent leur forme du bureau. Les arrondis de la maquette ne sont pas repris.
- **Textes** : ceux de `src/locales/`, identiques sur bureau et sur mobile. Les variantes de la maquette (paragraphes du hero, « En apprentissage », étiquettes des certifications, « Scrum », titre des références) ne sont pas reprises.
- **Survols** : toutes les règles `:hover` sont placées sous `@media (hover: hover)`. Au toucher, rien ne les remplace.
- **Animations** : les apparitions (section 7) sont gardées. L'éventail des cartes de l'accueil n'existe pas sur mobile. En mouvement réduit, rien ne bouge et le carrousel des projets change de carte sans glissement.
- **Cibles tactiles** : 44 × 44 px au moins.
- Toujours valables : `flex-wrap` et `flex-basis`, aucune largeur fixe sur un conteneur, `svh` pour les hauteurs plein écran.

### 10.1 Socle

- Variables, sous le point de rupture : `--gutter: 36px` (marges latérales des sections, de l'en-tête et du pied de page), `--section-y: 72px` (marge verticale des sections), `--tabbar-h: 64px`, et `--nav-height` passe à 64 px (le `scroll-margin-top` des sections suit).
- Les sections perdent leur `min-height` plein écran : hauteur naturelle, `padding: var(--section-y) var(--gutter)`, filet haut `1px solid var(--line)` (sauf le hero).
- Balise `viewport` de `index.html` : ajouter `viewport-fit=cover`, sinon `env(safe-area-inset-bottom)` vaut 0.
- Tailles : `h1` du hero 48 px (`line-height: 1.05`) ; rôle 34 px ; `h2` de section 42 px (`line-height: 1.1`) ; `h1` de `/projects` 48 px.
- Aucun défilement horizontal, à aucune largeur. À 435 px, la page mesurait 564 px de large le 20 octobre 2026 : trouver l'élément responsable avant tout le reste.

### 10.2 En-tête et barre d'onglets

**En-tête** : même `Navbar`, toujours `sticky`, 64 px de haut, `padding: 0 28px 0 var(--gutter)`. Le nom passe à 24 px. Les quatre liens sont masqués ; restent les boutons thème et langue (drapeau, comme sur bureau), en `IconLink` de 44 px.

**Barre d'onglets (`TabBar`)**, affichée seulement sous le point de rupture :

- `nav` avec l'`aria-label` de la navigation principale, qui contient une `ul`. La `nav` du bureau est masquée (`display: none`) au même moment : une seule est lue à la fois.
- `position: fixed` en bas, pleine largeur, hauteur `var(--tabbar-h)` plus `padding-bottom: env(safe-area-inset-bottom)`, fond `--bg`, filet haut `1px solid var(--line)`.
- Quatre onglets en `grid-template-columns: repeat(4, 1fr)` : Skills, Projects, About, Contact (pas d'onglet Accueil). Chacun : icône de 22 px (`stroke-width: 1.6`) au-dessus du libellé (12 px), écart de 4 px, zone cliquable sur toute la hauteur.
- Icônes : les tracés SVG de la maquette (dessins de Lucide, licence ISC), recopiés dans un composant `TabIcon`. Pas de dépendance `lucide-react`.
- Onglet inactif `--muted` ; onglet actif `--accent`, graisse 500, `aria-current` comme dans la `Navbar`, et un trait de 28 × 2 px `--accent` centré sur le filet du haut.
- Mêmes liens et même mécanisme que la `Navbar` (`Link` vers `/` avec `state`, puis `scrollToSection`), donc fonctionnels depuis `/projects`. Actif : la section visible (`useActiveSection`), aucun dans le hero ; sur `/projects`, Projects.
- Le `body` reçoit `padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom))` : le pied de page ne passe pas sous la barre.

### 10.3 Hero

- `padding: 72px var(--gutter) 80px`, contenu aligné à gauche : nom, rôle, les quatre ronds (44 px, même ordre et mêmes liens), puis les trois paragraphes de 6.2, textes inchangés. Pas de filet doré ni de décalage de 40 px.
- Le champ de code (`CodeField`) n'est pas affiché : il est remplacé par un halo, `radial-gradient(120% 60% at 80% 0%, <--accent à 16 %>, transparent 70%)`. Thème clair à valider à l'écran.
- Le rôle s'anime comme sur bureau.

### 10.4 Skills

- Cinq groupes empilés, écart de 22 px. Le libellé de chaque ligne devient un titre au-dessus des pastilles (Cormorant 24 px, graisse 500, `--accent`), les pastilles passent à la ligne (`gap: 8px`). Mêmes `Pill` que sur bureau, icônes comprises ; ligne Learning en pointillés.
- Certifications : les deux blocs empilés, contenu et étiquettes de 6.3.

### 10.5 Projects (accueil) : carrousel

- Sous le point de rupture, `ProjectCarousel` remplace la grille de trois cartes : une carte visible à la fois, les trois projets `featured`.
- Glissement au doigt sans bibliothèque : conteneur en `overflow-x: auto` et `scroll-snap-type: x mandatory`, cartes en `scroll-snap-align: center`.
- Sous la carte : boutons Précédent et Suivant (ronds de 44 px, `aria-label` traduits) aux deux bords, et au centre trois points cliquables (zone de 32 × 44 px, `aria-label` traduits) au-dessus d'un compteur « 1 / 3 ». Point actif : 24 × 6 px `--accent` ; inactifs : 6 × 6 px `--muted`. La navigation boucle (après le dernier, le premier).
- Boutons, points et compteur suivent aussi le glissement au doigt.
- Accessibilité : conteneur en `role="region"`, `aria-roledescription` traduit (« carousel » / « carrousel »), `aria-label` = titre de la section. Le compteur est en `aria-live="polite"`. Les cartes hors écran sont `inert` : le Tab ne passe que par la carte visible.
- Carte : même `FeaturedProjectCard`, autre disposition. Capture en haut, 200 px de haut, sans voile (tant qu'elle manque : la zone en pointillés de 6.4, sur ces 200 px). Étiquette en haut à droite. Puis titre (Cormorant 30 px), type, « The project » et « How it was built » **empilés**, le second sous un filet `--line` avec 16 px de marge, pastilles centrées, lien GitHub dans le coin bas droit. Le titre reste le lien vers le site en ligne.
- « View all projects » calé à droite, comme sur bureau.

### 10.6 Page `/projects`

- Les `ProjectRow` sont empilées et prennent le style de la carte mobile (10.5) : `ProjectCard` en pleine largeur, capture de 200 px en haut, blocs « The project » et « How it was built » empilés. Pas de carrousel. Niveaux de titres inchangés.
- Barre d'onglets présente, Projects actif.

### 10.7 About et références

- Accroche en Cormorant italique 27 px `--accent`, puis les paragraphes et la conclusion de 6.5 (`strong` inchangé), puis Soft Skills.
- Les références restent dans About, avec leur titre et le bouton pause sur la même ligne (WCAG 2.2.2).
- Tuiles réduites à 80 % (128 × 70 px, case du logo 96 × 45 px), bords fondus à 15 % au lieu de 7 %. **[PROPOSÉ]** à valider à l'écran à T24f.

### 10.8 Contact et pied de page

- Titre de 42 px sur plusieurs lignes, introduction, formulaire. Le cadre autour des champs disparaît : les champs sont empilés, écart de 18 px.
- Champs de 52 px de haut, texte à 16 px au moins (en dessous, iOS zoome au focus). Bouton d'envoi en pleine largeur, 52 px, couleurs de 6.6.
- Pied de page sous la section, `padding: 24px var(--gutter) 32px` : « © 2026 Yoan Cuervo » à gauche, à droite un lien « Back to top ↑ » / « Haut de page ↑ » (zone de 44 px de haut) qui ramène en haut de la page. Ce lien n'existe que sur mobile. Même pied de page sur `/projects`.

## 11. Déploiement

- Dépôt GitHub public. Nom du dépôt **[À FOURNIR]** : il fixe `base` dans `vite.config.ts` (`'/nom-du-depot/'`, ou `'/'` si le dépôt s'appelle `<utilisateur>.github.io`).
- GitHub Actions : à chaque `push` sur `main`, installation, `biome check`, `tsc --noEmit`, `vite build`, publication du dossier `dist` sur GitHub Pages (actions officielles `upload-pages-artifact` et `deploy-pages`). Le build reçoit la clé Web3Forms par la variable du dépôt `VITE_WEB3FORMS_KEY` (Settings → Secrets and variables → Actions → Variables).
- Dans les réglages du dépôt : Pages › Source = GitHub Actions.
- Les images sont importées depuis `src/assets` (Vite gère alors le préfixe `base`). Ne jamais écrire de chemin absolu en `/…` à la main.
- Balises de `index.html` (T18) : `title` (« Yoan Cuervo », comme `meta.title`), `description`, `theme-color` (`#0f0f0f` en sombre, `#e8e4df` en clair, selon `prefers-color-scheme`), favicon et icône d'écran d'accueil (`/favicon.png` : Vite ajoute le préfixe `base` à ce chemin absolu, en développement comme en build ; `%BASE_URL%` le doublait en développement), Open Graph (type, URL, titre « Yoan Cuervo · Web Developer », description, image avec dimensions et texte alternatif) et `twitter:card`. Les robots des réseaux n'exécutent pas JavaScript et veulent des adresses absolues : l'URL du site, `https://yoancuervo.github.io/Portfolio/`, est écrite en entier. Ces balises restent en anglais (langue par défaut du site).
- Les images de `public/` ne sont pas importées depuis `src/assets` : elles sont référencées par `index.html`, hors de React. Elles sont générées par Edge en mode sans interface à partir de `scripts/share-images/*.html` (commande en tête de chaque fichier) : l'image de partage reprend le hero en thème sombre, la favicon recolore le monogramme fourni par Yoan.

## 12. Contenus manquants

État au 20 octobre 2026 : il ne manque plus que les contenus des projets. Yoan les fournira une fois les projets déployés (décision du 16 octobre 2026) ; d'ici là, ils restent entre crochets ou en pointillés.

| Élément | Où |
|---|---|
| URL du site en ligne de Wedoo et de Poke_Gacha (les dépôts GitHub sont renseignés) | Projets |
| Captures d'écran de Wedoo et de Poke_Gacha | Projets |
| Projet 3 complet (et projets 4 et 5 pour `/projects`, sinon la page n'en liste que deux ou trois) | Projets |

Réglés depuis : carrousel complet avec ses 20 logos (T23), textes français validés par Yoan (20 octobre 2026), nom du dépôt (`Portfolio`), service de formulaire (Web3Forms, clé fournie par la CI, T13), liens GitHub, LinkedIn et Discord, formule « first assistant director in the audiovisual industry ».

## 13. Backlog

Chaque ticket est livrable seul. « Dépend de » indique l'ordre. Un ticket est fini quand ses critères sont remplis **dans les deux thèmes et les deux langues**, sans erreur Biome ni TypeScript.

### Lot 0 — Socle

**T01 · Initialiser le projet**
Vite + React + TypeScript, Biome, scripts `dev`, `build`, `preview`, `check`. Arborescence de la section 4 créée (dossiers vides acceptés).
Critères : `npm run dev` affiche une page vide sans erreur ; `npm run check` passe.

**T02 · Déploiement continu** — dépend de T01
`base` dans `vite.config.ts`, workflow GitHub Actions, Pages activé.
Critères : un `push` sur `main` met le site en ligne ; l'URL publique s'affiche sans fichier en 404.

**T03 · Styles de base** — dépend de T01
`tokens.css` (tableau 5.1, deux thèmes), `base.css` (reset, polices auto-hébergées, focus visible, `scroll-behavior`, `reduced-motion`), `animations.css`.
Critères : changer `data-theme` à la main dans l'inspecteur bascule toutes les couleurs ; seules les graisses listées en 5.2 sont chargées.

### Lot 1 — Fondations

**T04 · Thème** — dépend de T03
`ThemeContext`, script anti-flash, mémorisation.
Critères : le choix survit au rechargement ; pas de flash ; première visite conforme à la préférence système.

**T05 · Langue** — dépend de T01
`LanguageContext`, `en.ts` complet, `fr.ts` typé `typeof en`, attribut `lang` de `<html>`.
Critères : supprimer une clé de `fr.ts` casse la compilation ; le choix survit au rechargement.

**T06 · Routage et gabarit** — dépend de T04, T05
`HashRouter`, deux routes, redirection, `Navbar`, `Footer`, `scrollToSection`, navigation vers une section depuis `/projects`.
Critères : les quatre liens défilent vers la bonne section depuis les deux pages ; le titre de section n'est pas masqué par la navigation ; les deux boutons ronds fonctionnent et leur `aria-label` suit l'état.

**T07 · Composants d'interface** — dépend de T03
`Pill` (deux tailles, variante pointillés, icône optionnelle), `Tag`, `IconLink`, `ArrowLink`, `TechIcon`, `BlurDecor`, `Section`.
Critères : conformes à 5.4 et 5.5 ; icônes en `currentColor`.

### Lot 2 — Page d'accueil

**T08 · Hero** — dépend de T06, T07 · spécification 6.2
Critères : colonne de 800 px centrée, contenu aligné à gauche ; nom lu « Yoan Cuervo » par un lecteur d'écran (pas lettre par lettre) ; l'enveloppe défile vers Contact.

**T09 · Skills** — dépend de T07 · spécification 6.3
Données dans `data/skills.ts` et `data/certifications.ts`.
Critères : ordre des pastilles identique au tableau ; ligne Learning en pointillés.

**T10 · Projects** — dépend de T07 · spécification 6.4
`ProjectCard`, `ProjectRow` (prop `headingLevel`), `ProjectsSection`, `data/projects.ts`.
Critères : la card entière est un lien externe ; pas de lien si `liveUrl` est `null` ; pas de lien GitHub si `repoUrl` est `null` ; l'accueil n'affiche que les projets `featured` ; « View all projects » est à droite.

**T11 · About et carrousel** — dépend de T07 · spécification 6.5
Critères : deux rangées en sens opposés, sans saut visible à la boucle ; pause au survol ; à l'arrêt en mouvement réduit ; la copie dupliquée est ignorée des lecteurs d'écran.

**T12 · Contact, interface** — dépend de T07 · spécification 6.6
Critères : trois champs dans le cadre, bouton dessous ; « Let's talk about it. » en graisse normale ; contact et pied de page tiennent dans un écran de 900 px de haut.

**T13 · Contact, envoi** — dépend de T12
Validation, `fetch`, états du tableau 6.6, champ leurre.
Critères : un message de test arrive dans la boîte de Yoan ; chaque état du tableau est atteignable et annoncé aux lecteurs d'écran ; en cas d'échec, la saisie n'est pas perdue.

### Lot 3 — Page des projets

**T14 · `/projects`** — dépend de T10 · spécification 6.7
Critères : tous les projets listés ; « Projects » souligné dans la navigation ; « Back » ramène sur la section Projects de l'accueil (modifié le 20 octobre 2026, avant : en haut de l'accueil) ; niveaux de titres corrects.

### Lot 4 — Mouvement

**T15 · Animations d'entrée** — dépend de T08 à T11 · spécification 7
`useReveal`, `AnimatedRole` (le rôle remplace le nom comme élément animé, décidé à T15), apparitions par section, survols (cards, pastilles, étiquettes rectangulaires).
Critères : durées et décalages du tableau ; seul le rôle s'anime dans le hero ; chaque animation ne se joue qu'une fois ; rien ne bouge ni ne reste masqué en mouvement réduit.

**T16 · Lien de navigation actif** — dépend de T06
`useActiveSection`.
Critères : le lien souligné suit le défilement, sans clignotement entre deux sections.

**T22 · Champ de code du hero** — dépend de T08 · spécification 6.2 (ajouté le 15 octobre 2026)
`CodeField` (canvas), `data/codeGlyphs.ts`, tokens `--font-mono`, `--hole`, `--lens`, `--code-intensity`, `data-lens-anchor` sur la dernière lettre du nom, fond plein des `IconLink`.
Critères : champ à peine visible au repos, en tronçons ; les lignes glissent vers la gauche à des vitesses différentes ; la lentille courbe les lignes autour d'une ombre de 48 px et suit le curseur sans retard visible ; souris hors du hero, la lentille revient en douceur sur le « o » de « Cuervo » ; le texte du hero reste lisible ; défilement fluide avec la lentille active ; révélateur simple et aucun mouvement en mouvement réduit ; animation suspendue quand le hero n'est plus à l'écran ; ignoré des lecteurs d'écran ; conforme dans les deux thèmes.

**T23 · Carrousel des références** — dépend de T11 · spécification 6.5 (ajouté le 16 octobre 2026, repris de T20)
`data/clients.ts` en deux rangées mélangées (diffuseurs, productions, agences, marques), logos dans `src/assets/logos/`.
Critères : noms tirés du parcours de Yoan ; un logo officiel par nom, sans nom affiché ; logos en couleurs d'origine ; au survol, la rangée s'arrête, le logo grossit légèrement et une infobulle donne le nom sans être coupée ; le bouton pause reste cliquable ; boucle sans vide sur grand écran ; conforme dans les deux thèmes.

### Lot 5 — Finitions

**T17 · Passe d'accessibilité** — dépend des lots 2 à 4 · spécification 9
Critères : parcours complet au clavier ; audit Lighthouse accessibilité à 100 dans les deux thèmes ; lien d'évitement présent.

**T18 · Référencement et partage** — dépend de T05
`title`, `description`, Open Graph, `theme-color`, favicon.
Critères : l'aperçu de lien affiche titre, description et image.

**T19 · Project Cards** — dépend de T10 · spécification 6.4 (ajouté le 17 octobre 2026, maquette fournie le 19 octobre 2026)
Refonte visuelle de la section Projects de la page d'accueil : trois grandes cartes. Chaque carte est une image qui contient tous les éléments actuels : titre, type, étiquettes, « Le projet », « Sa construction » et lien GitHub. La page `/projects` garde la présentation actuelle en rangées.
Critères : trois cartes côte à côte à 1440 px, la section tient dans l'écran sous la `Navbar` ; capture sur toute la carte, texte lisible dans les deux thèmes ; textes de 6.4 inchangés ; chaque carte est une étape du Tab, suivie de son lien GitHub ; entrée en éventail et effets de survol de 6.4, tous coupés en mouvement réduit, la mise en avant aussi au clavier ; `/projects` inchangée.

**T21 · Performance** — dépend de T19, T20 (ancien T19, renuméroté le 17 octobre 2026) · peut commencer sans attendre T20 : les captures des projets passeront par le même traitement à leur arrivée
Images au bon format et à la bonne taille, `loading="lazy"` hors du premier écran, `width` et `height` renseignés.
Critères : Lighthouse performance ≥ 90 sur mobile ; aucun décalage de mise en page au chargement.

### Lot 6 — Contenu

**T20 · Contenus réels** — dépend de la fourniture des éléments de la section 12 · **en attente** du déploiement des projets (il ne reste que leurs contenus)
Critères : plus aucun texte entre crochets ni zone en pointillés sur le site en ligne.

### Lot 7 — Mobile

T24 (version mobile) est découpé en sept tickets le 20 octobre 2026, une fois la maquette reçue · spécification 10. Exception à la règle des demandes de fusion (décision de Yoan, 20 octobre 2026) : chaque ticket T24 part de la branche d'intégration `docs/T24-mobile-tickets` et y revient par sa demande de fusion ; cette branche ne rejoint `develop` qu'une fois les sept tickets finis, par une seule demande de fusion. La CI ne tourne pas sur ces demandes intermédiaires : `npm run check` et `npm run build` en local en tiennent lieu. Pour chacun, en plus des critères listés : rendu bureau inchangé à 1440 px ; aucun défilement horizontal à 320, 375, 390, 430 et 767 px ; conforme dans les deux thèmes et les deux langues, au clavier et en mouvement réduit.

**T24a · Socle mobile** · spécification 10 et 10.1
Point de rupture, variables, `viewport-fit=cover`, tailles de titres, hauteurs naturelles et filets des sections, survols sous `@media (hover: hover)`, correction du débordement.
Critères : aucun défilement horizontal aux largeurs listées ni à 768 et 1024 px ; aucun survol ne reste affiché après un appui au toucher ; à l'arrivée sur une section, son titre n'est pas masqué par l'en-tête de 64 px.

**T24b · Navigation mobile** — dépend de T24a · spécification 10.2 et 10.8 (pied de page)
En-tête mobile, `TabBar`, `TabIcon`, lien « Haut de page » du pied de page.
Critères : les quatre onglets défilent vers la bonne section depuis les deux pages ; l'onglet actif suit la section visible, aucun dans le hero, Projects sur `/projects` ; une seule `nav` principale lue à la fois ; le pied de page n'est pas caché par la barre, zone de sécurité de l'iPhone comprise ; cibles de 44 px au moins.

**T24c · Hero et Skills mobiles** — dépend de T24a · spécification 10.3 et 10.4
Critères : disposition de la maquette, textes du cahier ; champ de code absent et halo affiché ; le nom est lu « Yoan Cuervo » par un lecteur d'écran ; ordre des pastilles inchangé, ligne Learning en pointillés.

**T24d · Carrousel des projets** — dépend de T24a · spécification 10.5
`ProjectCarousel`, disposition mobile de `FeaturedProjectCard`.
Critères : glissement au doigt d'une carte à l'autre ; boutons, points et compteur synchronisés avec le glissement ; la navigation boucle ; seule la carte visible est atteignable au Tab ; le changement de carte est annoncé ; changement sans glissement en mouvement réduit ; grille de trois cartes inchangée sur bureau.

**T24e · `/projects` mobile** — dépend de T24a · spécification 10.6
Critères : rangées empilées au style de la carte mobile ; niveaux de titres inchangés ; « Back » toujours fonctionnel.

**T24f · About et références mobiles** — dépend de T24a · spécification 10.7
Critères : boucle du carrousel sans vide à toutes les largeurs listées ; bouton pause atteignable et fonctionnel ; taille des tuiles validée à l'écran par Yoan.

**T24g · Contact mobile** — dépend de T24a · spécification 10.8
Critères : pas de zoom au focus sur iOS ; bouton en pleine largeur ; tous les états du tableau 6.6 inchangés.

Ordre conseillé : T01 → T02 → T03 → T04, T05 → T06 → T07 → T08 à T12 → T14 → T22 → T13 → T15, T16 → T17, T18 → T23 → T19 → T20 → T21 → T24a → T24b → T24c à T24g. Chaque ticket passe par une demande de fusion vers `develop`, vérifiée par le job `build` et en local avec `npm run preview`. `main`, qui déclenche la mise en ligne, ne reçoit `develop` qu'en fin de projet, par une seule demande de fusion (décision du 8 octobre 2026 : ne pas exposer un site à moitié fini).

## 14. Consignes pour Claude Code

À recopier dans le `CLAUDE.md` du dépôt :

- Ce fichier (`docs/ARCHITECTURE.md`) est la source de vérité. En cas d'écart avec une demande, le signaler avant de coder.
- Un ticket par branche et par demande de fusion. Ne pas déborder du ticket.
- Aucune nouvelle dépendance sans accord. Dépendances prévues : `react`, `react-dom`, `react-router`, `@fontsource/cormorant`, `@fontsource/ibm-plex-sans`, `simple-icons` ; en développement : `vite`, `typescript`, `@biomejs/biome`.
- Aucune couleur ni graisse en dur dans les composants : uniquement les variables de `tokens.css`.
- Aucun texte visible en dur dans les composants : tout passe par `locales/`.
- Pas de style en ligne (les maquettes en utilisent, c'est une contrainte de l'outil de maquette, pas un modèle).
- Ne pas inventer de contenu : ce qui manque reste entre crochets jusqu'à T20.
- Yoan est en formation : expliquer brièvement les choix non évidents dans la description de la demande de fusion, sans commenter l'évident dans le code.
