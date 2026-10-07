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
| Formulaire de contact | Service de formulaire tiers qui relaie vers la boîte mail de Yoan **[FIGÉ]**. Service : Web3Forms via `fetch` **[PROPOSÉ]** (pas de dépendance, cohérent avec l'apprentissage de `fetch`). Vérifier le quota gratuit au moment du ticket. |
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

- Les liens de navigation appellent une fonction `scrollToSection(id)` qui fait `document.getElementById(id)?.scrollIntoView()`.
- Depuis `/projects`, un clic sur Skills, About ou Contact fait `navigate('/', { state: { scrollTo: id } })`. `HomePage` lit cet état dans un `useEffect` et défile vers la section.
- Chaque section a `scroll-margin-top: 72px` (hauteur de la navigation).
- Le défilement est doux (`scroll-behavior: smooth`), sauf si `prefers-reduced-motion: reduce`.

## 4. Arborescence cible

```
portfolio/
├── .github/workflows/deploy.yml
├── public/
│   └── favicon.svg                 [À FOURNIR] ou [PROPOSÉ] : initiales YC en Cormorant
├── src/
│   ├── main.tsx
│   ├── App.tsx                     HashRouter + providers + routes
│   ├── styles/
│   │   ├── tokens.css              variables des deux thèmes
│   │   ├── base.css                reset, typographie, focus, reduced-motion
│   │   └── animations.css          keyframes partagées
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
│   │   └── clients.ts
│   ├── assets/
│   │   ├── icons/                  SVG en `currentColor` (source : paquet simple-icons)
│   │   ├── flags/                  fr.svg, gb.svg
│   │   ├── projects/               captures d'écran [À FOURNIR]
│   │   └── logos/                  logos productions/clients [À FOURNIR]
│   ├── components/
│   │   ├── layout/   Navbar, Footer, Section, BlurDecor
│   │   ├── ui/       Pill, Tag, IconLink, ArrowLink, TechIcon
│   │   ├── hero/     Hero, AnimatedName
│   │   ├── skills/   Skills, StackRow, CertificationItem
│   │   ├── projects/ ProjectsSection, ProjectRow, ProjectCard
│   │   ├── about/    About, Marquee, ClientTile
│   │   └── contact/  Contact, ContactForm, Field
│   └── pages/
│       ├── HomePage.tsx
│       └── ProjectsPage.tsx
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
| `--rose` | Étiquettes (équipe, statut de certification), citation | `#e8b4b8` | `#8f3f4b` |
| `--gold` | Bordure des pastilles, filet vertical du hero | `#c9b896` | `#8f7d4f` |
| `--icon` | Teinte des icônes de techno et de réseaux | `#c9b896` | `#5f5030` |
| `--line` | Séparateurs, bordure des cards | `#34302c` | `#c9c2b8` |
| `--card` | Fond des cards projet, du cadre du formulaire, des champs | `#181716` | `#f4f1ed` |
| `--control` | Bordure des boutons ronds, champs, zones en pointillés | `#6e6558` | `#7d746a` |
| `--tile-bg` | Fond des tuiles du carrousel | transparent | `#f4f1ed` |
| `--tile-border` | Bordure des tuiles du carrousel | `#34302c` | `#b5ada1` |
| `--btn-bg` | Bouton d'envoi, fond | `#d4a574` | `#0f0f0f` |
| `--btn-fg` | Bouton d'envoi, texte | `#0f0f0f` | `#e8e4df` |
| `--w-body` | Graisse du texte courant | 300 | 400 |
| `--w-lead` | Graisse des paragraphes du hero | 400 | 500 |
| `--w-italic` | Graisse de « Web Developer » et de la citation | 400 | 500 |

Les trois couleurs des halos décoratifs sont identiques dans les deux thèmes : `#d4a574`, `#e8b4b8`, `#c9b896`. Seule leur opacité change (voir 5.4).

### 5.2 Typographie

- Titres : **Cormorant** (serif). Graisses utilisées : 400, 600, italique 400, italique 500.
- Texte : **IBM Plex Sans**. Graisses utilisées : 300, 400, 500.
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
| Accroche d'About | Cormorant | 31 px | 400 | 1.25 | `--fg` |
| Citation | Cormorant italique | 30 px | `--w-italic` | 1.2 | `--rose` |
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

**Pill (pastille de compétence)** : `inline-flex`, hauteur 36 px, `padding: 0 14px`, `gap: 8px`, bordure `1px solid var(--gold)`, arrondi 999 px, texte 14 px graisse 400 `--fg`, marge `0 10px 10px 0`. Icône optionnelle 18 × 18 px devant le texte. Variante `dashed` (bordure en pointillés) pour la ligne « Learning ».

**Pill petite (techno d'un projet)** : même forme, hauteur 28 px, `padding: 0 12px`, texte 13 px, sans icône.

**Tag (étiquette)** : forme de la petite pastille, bordure et texte `--rose`. Variante `dashed` pour « In progress ».

**IconLink (bouton rond)** : 44 × 44 px (navigation) ou 48 × 48 px (hero), bordure `1px solid var(--control)`, arrondi 50 %, icône 20 × 20 px centrée, `aria-label` obligatoire.

**ArrowLink (« View GitHub repo »)** : `inline-flex`, `gap: 8px`, hauteur minimale 44 px, texte 14 px graisse 500 `--accent`, souligné (`text-underline-offset: 4px`). Icône GitHub 16 px devant, flèche diagonale 16 px derrière (`path d="M7 17 17 7M9 7h8v8"`, trait 1.8).

**Icônes de techno** : dans les maquettes ce sont des images pré-teintées, une par thème. Dans le code : un seul SVG par techno en `fill="currentColor"`, coloré par `color: var(--icon)`. Source : paquet npm `simple-icons`.

## 6. Structure des pages

### 6.1 Navigation (`Navbar`) — commune aux deux pages

- `position: sticky; top: 0; z-index: 20`, hauteur minimale 72 px, `padding: 8px 6%`, fond `--bg`, bordure basse `1px solid var(--line)`.
- Gauche : « Yoan Cuervo », lien vers le haut de l'accueil.
- Droite, espacés de 28 px : Skills, Projects, About, Contact, puis deux boutons ronds espacés de 8 px.
- **Lien actif** : souligné (`text-underline-offset: 6px`), transition 150 ms. Sur l'accueil, c'est la section visible (`useActiveSection`). Sur `/projects`, c'est « Projects ».
- **Bouton thème** : en sombre il montre un soleil (`aria-label="Switch to light theme"`), en clair une lune (`aria-label="Switch to dark theme"`).
- **Bouton langue** : il affiche le drapeau de la langue **vers laquelle on bascule**. Site en anglais : drapeau français, `aria-label="Switch the site to French"`. Site en français : drapeau britannique, `aria-label="Passer le site en anglais"`. Drapeau en 24 × 16 px, `alt=""`.
- `aria-label` de la balise `nav` : « Main navigation » / « Navigation principale ».

### 6.2 Hero (`#home`)

- Hauteur : `min-height: calc(100svh - 72px)` (828 px sur la maquette de 900 px), contenu centré verticalement et horizontalement, `padding: 32px 6%`.
- Une colonne centrée de `max-width: 800px`, dont le contenu est **aligné à gauche**, `gap: 22px`.
- Dans l'ordre :
  1. `h1` « Yoan Cuervo », une `span` par lettre pour l'animation, `aria-label="Yoan Cuervo"` sur le `h1` et `aria-hidden="true"` sur chaque lettre. `overflow: hidden` et `padding: 0.06em 0 0.1em` pour masquer les lettres avant leur montée.
  2. Un bloc décalé de `padding-left: 40px` qui contient :
     - « Web Developer » (voir typographie) ;
     - un groupe avec filet vertical : `margin-left: -32px; padding: 6px 0 6px 30px; border-left: 2px solid var(--gold)`, `gap: 22px`, qui contient :
       - quatre boutons ronds de 48 px espacés de 12 px : GitHub, LinkedIn, Discord (liens externes), enveloppe (défile vers Contact, `aria-label="Email me, go to the contact form"`) ;
       - trois paragraphes, `max-width: 760px`, `gap: 10px`.

Textes (anglais, validés) :

> Hello there!
> I am a problem solver passionate about building thoughtful, engaging digital experiences.

> Before moving into web development, I worked as a 1st AD in audiovisual industry, where I gained strong skills in project coordination, teamwork, and problem-solving. Today, I apply that same mindset to development, combining creative thinking with technology to turn ideas into functional experiences.

> I'm constantly striving to improve my skills and design principles. I'm always eager to learn, collaborate, and contribute to projects that combine conceptual thinking with new technology.

Le premier paragraphe a un retour à la ligne après « Hello there! ».

### 6.3 Skills (`#skills`)

- `min-height: 100svh`, contenu centré verticalement, `gap: 36px`, `padding: 104px 6% 48px`.
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

- `min-height: 100svh`, `gap: 22px`, `padding: 100px 6% 40px`.
- `h2` « Projects », trois `ProjectRow` (les projets `featured`), puis le lien « View all projects » **calé à droite** (Cormorant italique 500, 24 px, `--accent`) vers `/projects`.

**`ProjectRow`** (`article`, `flex-wrap`, `gap: 18px 40px`, `padding-top: 20px`, `border-top: 1px solid var(--line)`) :

1. **`ProjectCard`** à gauche, `flex: 0 1 350px`. C'est **un lien entier vers le site en ligne** (nouvel onglet, `rel="noopener noreferrer"`). `display: flex; gap: 18px; padding: 14px`, fond `--card`, bordure `1px solid var(--line)`. Contient :
   - la capture d'écran, `flex: 0 0 150px`, hauteur minimale 124 px (tant qu'elle manque : zone en pointillés `1px dashed var(--control)` avec le texte « Project screenshot ») ;
   - le titre du projet et son type (14 px, `--muted`).
   - Il n'y a **pas** de libellé « View site » : il a été retiré.
   - Survol : la capture zoome à `scale(1.03)` en 200 ms.
   - Si le projet n'a pas de site en ligne : **[PROPOSÉ]** la card est rendue en `div`, sans lien ni effet de survol.
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

- `min-height: 100svh`, `gap: 40px`, `padding: 104px 0 48px` (pas de marge latérale sur la section : le carrousel va d'un bord à l'autre ; les blocs de texte ont leur propre `padding: 0 6%`).
- `h2` « About me », puis deux colonnes (`gap: 32px 72px`) :
  - gauche (`flex: 3 1 480px`, `gap: 18px`) : accroche, paragraphe (`max-width: 40em`), citation (`blockquote`) ;
  - droite (`flex: 2 1 340px`) : `h3` « Soft Skills » et dix pastilles sans icône.
- Puis `h3` « Productions, clients and agencies » et le carrousel.

Textes :

> After ten years in the audiovisual industry as a first assistant director, I traded my call sheets for code.

> From 2014 to 2025, I organized shoots for fiction, commercials and live broadcasts, coordinated crews and met deadlines under heavy constraints. Today I build complete web applications and I am training in AI integration.

> “Imagination rules the world.”

Soft skills : Adaptability, Analytical thinking, Prioritization, Debugging, Fast learner, Initiative, Agile methods (Scrum), Autonomy, Product collaboration, User understanding.

**Carrousel (`Marquee`)** : deux rangées espacées de 14 px, défilement continu.

- Rangée 1, vers la droite : Canal+, Eurosport, France Télévisions, When We Were Kids, Studio Bagel, [À FOURNIR].
- Rangée 2, vers la gauche : Les Guignols, Kayenta, Darjeeling, 48 Hour Film Project, [À FOURNIR], [À FOURNIR].
- Tuile (`ClientTile`) : hauteur 88 px, `padding: 0 26px 0 14px`, `gap: 14px`, `margin-right: 16px`, fond `--tile-bg`, bordure `1px solid var(--tile-border)`, arrondi 2 px. Logo 58 × 58 px (tant qu'il manque : carré en pointillés « Logo »), nom en Cormorant 600, 24 px.
- Technique : chaque rangée contient la liste **deux fois** (la seconde copie en `aria-hidden="true"`), `width: max-content; white-space: nowrap`, animation de `translateX(-50%)` à `0` (rangée 1) ou de `0` à `-50%` (rangée 2), 40 s, linéaire, infinie.
- Bords fondus : `mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)` sur le conteneur.
- Pause au survol. Arrêt complet si `prefers-reduced-motion: reduce`.

### 6.6 Contact (`#contact`) et pied de page

- `min-height: 100svh`, colonne centrée, `padding: 104px 6% 0`. Le pied de page est **dans** cette section, collé en bas : contact + pied de page tiennent ensemble dans un écran.
- Bloc central (`gap: 22px`, centré verticalement dans l'espace restant) :
  - `h2` centré : « What's on your mind? » en graisse 600, suivi de « Let's talk about it. » en graisse **normale** (400), sur la même ligne, 60 px.
  - Paragraphe centré : « Describe it in a few lines and I'll reply by email. » (17 px, `max-width: 34em`).
  - Formulaire, `max-width: 620px`, `gap: 18px` :
    - un **cadre** qui contient les trois champs : `padding: 28px`, fond `--card`, bordure `1px solid var(--line)`, arrondi 2 px, `gap: 18px` ;
    - le bouton d'envoi **hors du cadre**, centré dessous.
- Champs (libellé au-dessus, 14 px graisse 500, `gap: 6px`) :

| Libellé | Balise | Attributs |
|---|---|---|
| Name | `input type="text"` | `name="name"`, `autocomplete="name"`, requis |
| Email address | `input type="email"` | `name="email"`, `autocomplete="email"`, requis |
| Project description | `textarea rows="6"` | `name="message"`, requis, `resize: vertical` |

- Style des champs : hauteur 48 px (`input`), `padding: 0 14px` (`textarea` : `12px 14px`, interligne 1.5), fond `--card`, bordure `1px solid var(--control)`, arrondi 2 px, texte 16 px `--fg`.
- Bouton « Send my request » : hauteur 48 px, `padding: 0 32px`, sans bordure, arrondi 2 px, fond `--btn-bg`, texte `--btn-fg`, 15 px graisse 500.
- **Pied de page** : `border-top: 1px solid var(--line)`, `padding: 18px 0`, 14 px, `--muted`. Texte unique : « © 2026 Yoan Cuervo » (année calculée avec `new Date().getFullYear()`). La mention « Designed and built by me » a été retirée.

États du formulaire (comportement défini dans les notes de maquette, textes **[PROPOSÉ]**) :

| État | Comportement | Texte EN | Texte FR |
|---|---|---|---|
| Champ actif | Bordure `--accent`, transition 150 ms | | |
| Champ vide à l'envoi | Message sous le champ, relié par `aria-describedby`, `aria-invalid="true"` | This field is required. | Ce champ est obligatoire. |
| E-mail invalide | idem | Enter a valid email address. | Saisissez une adresse e-mail valide. |
| Envoi | Bouton désactivé, texte changé | Sending… | Envoi en cours… |
| Succès | Un message **remplace** le formulaire, annoncé par `role="status"` | Message sent. I'll get back to you by email. | Message envoyé. Je vous réponds par e-mail. |
| Échec réseau | Message au-dessus du bouton, `role="alert"`, le contenu saisi est conservé | Sending failed. Try again in a moment. | L'envoi a échoué. Réessayez dans un instant. |

Envoi : `fetch` en `POST` vers le service de formulaire, corps JSON `{ name, email, message }`. Ajouter un champ leurre caché (anti-robots). La clé du service va dans une variable `VITE_…` ; elle est publique par nature (visible dans le code livré), l'adresse mail de Yoan reste configurée côté service et n'apparaît jamais dans le dépôt.

### 6.7 Page `/projects` (`ProjectsPage`)

- Même `Navbar` (« Projects » souligné), page en colonne `min-height: 100svh`.
- `main` : `padding: 40px 6% 56px`, `gap: 22px` :
  1. lien « Back to home » avec flèche vers la gauche (15 px, `--accent`, hauteur minimale 44 px) ;
  2. `h1` « All projects » (76 px) ;
  3. **tous** les projets en `ProjectRow`, même composant que sur l'accueil. La maquette en montre cinq : Wedoo, Poke_Gacha, et trois emplacements vides.
- Niveaux de titres décalés d'un cran : titre de projet en `h2`, « The project » et « How it was built » en `h3` (sur l'accueil : `h3` et `h4`). `ProjectRow` reçoit donc une prop `headingLevel`.
- Pied de page identique, avec `margin: 0 6%`.

## 7. Animations

Règles communes : aucune animation au-delà de 500 ms sauf le carrousel ; les animations d'entrée ne se jouent qu'une fois ; avec `prefers-reduced-motion: reduce`, tout est coupé et le carrousel reste à l'arrêt.

| Zone | Déclencheur | Effet |
|---|---|---|
| Hero, nom | Chargement de la page | Chaque lettre monte depuis `translateY(115%)`, 500 ms, `cubic-bezier(.2,.7,.2,1)`, décalage de 40 ms par lettre (l'espace entre prénom et nom compte pour un cran : Y 0, o 40, a 80, n 120, C 200, u 240, e 280, r 320, v 360, o 400 ms) |
| Hero, reste | Chargement | Fondu 300 ms `ease-out`, lancé à 550 ms. Tout est en place en moins de 1,2 s |
| Skills | Entrée dans l'écran | Pastilles ligne par ligne : fondu 200 ms, décalage de 60 ms par ligne |
| Pastille | Survol | Bordure accentuée, 150 ms |
| Projects | Entrée dans l'écran | Les rangées montent de 16 px en fondu, 250 ms, décalage de 80 ms |
| Card projet | Survol | Capture à `scale(1.03)`, 200 ms |
| About, texte | Entrée dans l'écran | Fondu 250 ms |
| Carrousel | Permanent | Voir 6.5 |
| Navigation | Changement de section | Soulignement du lien actif, 150 ms |
| Thème | Clic | Transition des couleurs 200 ms |
| Champ de formulaire | Focus | Bordure accentuée, 150 ms |

Implémentation : un hook `useReveal` (IntersectionObserver, se déconnecte après le premier déclenchement) qui pose une classe ; les décalages passent par une variable CSS `--i` et `animation-delay: calc(var(--i) * 60ms)`.

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
| About, accroche | Après dix années dans l'audiovisuel comme premier assistant réalisateur, j'ai troqué mes feuilles de service contre du code. |
| About, paragraphe | De 2014 à 2025, j'ai organisé des tournages de fiction, de publicité et de direct, coordonné des équipes et tenu des délais sous forte contrainte. Je développe aujourd'hui des applications web complètes et je me forme à l'intégration de l'IA. |
| Citation | « L'imagination gouverne le monde. » |
| Soft skills | Adaptabilité, Esprit analytique, Gestion des priorités, Debugging, Apprentissage rapide, Prise d'initiative, Méthodes agiles (Scrum), Autonomie, Collaboration produit, Compréhension des utilisateurs |
| Carrousel | Productions, clients et agences |
| Contact | Un projet en tête ? Parlons-en. · Décrivez-le en quelques lignes, je vous réponds par e-mail. · Nom · Adresse e-mail · Description du projet · Envoyer ma demande |
| /projects | Retour à l'accueil · Tous les projets |
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
- Lien d'évitement « Skip to content » en premier élément focusable **[PROPOSÉ]** (absent des maquettes).
- Tout est utilisable au clavier, focus toujours visible.
- Zones cliquables d'au moins 44 × 44 px.
- Icônes décoratives : `aria-hidden="true"` ou `alt=""`. Boutons sans texte : `aria-label` traduit.
- Liens externes : nouvel onglet avec `rel="noopener noreferrer"`.
- Champs reliés à leur `label` par `for` / `id`, erreurs reliées par `aria-describedby`.
- `prefers-reduced-motion` respecté partout.
- Contrastes : les couleurs du thème clair ont été choisies plus sombres que leurs équivalents du thème sombre pour rester lisibles sur fond clair. Ne pas réutiliser `#d4a574`, `#e8b4b8` ou `#c9b896` pour du texte en thème clair.
- Les zones de texte doivent supporter l'allongement du français (environ 20 % de plus) sans casser la mise en page.

## 10. Responsive

Seul le bureau (1440 × 900 par section) est maquetté. **La version mobile n'est pas dessinée** : elle fera l'objet d'une maquette, puis d'un lot de tickets.

En attendant, coder de façon à ne rien bloquer :

- garder les `flex-wrap` et les `flex-basis` indiqués plus haut : les colonnes passent déjà l'une sous l'autre quand la largeur manque ;
- le nom du hero est déjà fluide (`clamp`) ;
- aucune largeur fixe en pixels sur un conteneur, seulement des `max-width` ;
- unités `svh` pour les hauteurs plein écran ;
- ne pas inventer de menu mobile : il sera dessiné.

## 11. Déploiement

- Dépôt GitHub public. Nom du dépôt **[À FOURNIR]** : il fixe `base` dans `vite.config.ts` (`'/nom-du-depot/'`, ou `'/'` si le dépôt s'appelle `<utilisateur>.github.io`).
- GitHub Actions : à chaque `push` sur `main`, installation, `biome check`, `tsc --noEmit`, `vite build`, publication du dossier `dist` sur GitHub Pages (actions officielles `upload-pages-artifact` et `deploy-pages`).
- Dans les réglages du dépôt : Pages › Source = GitHub Actions.
- Les images sont importées depuis `src/assets` (Vite gère alors le préfixe `base`). Ne jamais écrire de chemin absolu en `/…` à la main.
- Balises à prévoir dans `index.html` : `title`, `description`, Open Graph (titre, description, image), `theme-color`. Image de partage **[À FOURNIR]** ou générée à partir du hero.

## 12. Contenus manquants

| Élément | Où |
|---|---|
| URL GitHub, LinkedIn, Discord | Hero |
| URL du site en ligne et du dépôt de Wedoo et de Poke_Gacha | Projets |
| Captures d'écran de Wedoo et de Poke_Gacha | Projets |
| Projet 3 complet (et projets 4 et 5 pour `/projects`, sinon la page n'en liste que deux ou trois) | Projets |
| Logos des productions et clients (format SVG de préférence, version lisible sur fond sombre et sur fond clair) | Carrousel |
| Trois noms manquants du carrousel (une agence, un client, une production) | Carrousel |
| Validation des textes français proposés | Fichier `fr.ts` |
| Nom du dépôt GitHub | Déploiement |
| Compte et clé du service de formulaire | Contact |
| Favicon et image de partage | `index.html` |

Remarque de fond sur un texte validé : « I worked as a 1st AD in audiovisual industry » est fautif en anglais. La forme correcte est « in **the** audiovisual industry ». De plus, « 1st AD » ne sera pas compris hors du milieu : « first assistant director » est plus sûr (c'est déjà la formule utilisée dans la section About).

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
Critères : tous les projets listés ; « Projects » souligné dans la navigation ; « Back to home » ramène en haut de l'accueil ; niveaux de titres corrects.

### Lot 4 — Mouvement

**T15 · Animations d'entrée** — dépend de T08 à T11 · spécification 7
`useReveal`, animation du nom, apparitions par section, survols.
Critères : durées et décalages du tableau ; chaque animation ne se joue qu'une fois ; rien ne bouge en mouvement réduit.

**T16 · Lien de navigation actif** — dépend de T06
`useActiveSection`.
Critères : le lien souligné suit le défilement, sans clignotement entre deux sections.

### Lot 5 — Finitions

**T17 · Passe d'accessibilité** — dépend des lots 2 à 4 · spécification 9
Critères : parcours complet au clavier ; audit Lighthouse accessibilité à 100 dans les deux thèmes ; lien d'évitement présent.

**T18 · Référencement et partage** — dépend de T05
`title`, `description`, Open Graph, `theme-color`, favicon.
Critères : l'aperçu de lien affiche titre, description et image.

**T19 · Performance** — dépend de T20
Images au bon format et à la bonne taille, `loading="lazy"` hors du premier écran, `width` et `height` renseignés.
Critères : Lighthouse performance ≥ 90 sur mobile ; aucun décalage de mise en page au chargement.

### Lot 6 — Contenu

**T20 · Contenus réels** — dépend de la fourniture des éléments de la section 12
Critères : plus aucun texte entre crochets ni zone en pointillés sur le site en ligne.

### Lot 7 — Mobile

**T21 · Version mobile** — **bloqué** tant que la maquette mobile n'existe pas
À découper en tickets une fois la maquette validée (navigation, hero, rangées de projet, carrousel, formulaire).

Ordre conseillé : T01 → T02 → T03 → T04, T05 → T06 → T07 → T08 à T12 → T14 → T13 → T15, T16 → T17, T18 → T20 → T19 → T21. Déployer dès T02 : chaque ticket suivant est alors vérifiable en ligne.

## 14. Consignes pour Claude Code

À recopier dans le `CLAUDE.md` du dépôt :

- Ce fichier (`docs/ARCHITECTURE.md`) est la source de vérité. En cas d'écart avec une demande, le signaler avant de coder.
- Un ticket par branche et par demande de fusion. Ne pas déborder du ticket.
- Aucune nouvelle dépendance sans accord. Dépendances prévues : `react`, `react-dom`, `react-router-dom`, `@fontsource/cormorant`, `@fontsource/ibm-plex-sans`, `simple-icons` ; en développement : `vite`, `typescript`, `@biomejs/biome`.
- Aucune couleur ni graisse en dur dans les composants : uniquement les variables de `tokens.css`.
- Aucun texte visible en dur dans les composants : tout passe par `locales/`.
- Pas de style en ligne (les maquettes en utilisent, c'est une contrainte de l'outil de maquette, pas un modèle).
- Ne pas inventer de contenu : ce qui manque reste entre crochets jusqu'à T20.
- Yoan est en formation : expliquer brièvement les choix non évidents dans la description de la demande de fusion, sans commenter l'évident dans le code.
