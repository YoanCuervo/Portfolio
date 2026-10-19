import type { en } from "./en";

// \u00a0 is a non-breaking space: French puts one before "?", "!" and ":" and inside « », and it must not wrap.
export const fr: typeof en = {
  meta: {
    title: "Yoan Cuervo",
    name: "Yoan Cuervo",
  },
  a11y: {
    skipLink: "Aller au contenu",
    newTab: "(s'ouvre dans un nouvel onglet)",
  },
  nav: {
    label: "Navigation principale",
    skills: "Compétences",
    projects: "Projets",
    about: "À propos",
    contact: "Contact",
    switchToLight: "Passer au thème clair",
    switchToDark: "Passer au thème sombre",
    switchLang: "Passer le site en anglais",
  },
  hero: {
    role: "Développeur web",
    emailMe: "M'écrire, vers le formulaire de contact",
    links: {
      github: "GitHub (nouvel onglet)",
      linkedin: "LinkedIn (nouvel onglet)",
      discord: "Discord (nouvel onglet)",
    },
    greeting: "Bonjour\u00a0!",
    intro:
      "J'aime résoudre des problèmes et construire des expériences numériques soignées et engageantes.",
    background:
      "Avant le développement web, j'ai été premier assistant réalisateur dans l'audiovisuel, où j'ai acquis de solides compétences en coordination de projet, en travail d'équipe et en résolution de problèmes. J'applique aujourd'hui le même état d'esprit au développement\u00a0: associer créativité et technologie pour transformer des idées en expériences fonctionnelles.",
    learning:
      "Je cherche en permanence à améliorer mes compétences et mes principes de conception. J'ai toujours envie d'apprendre, de collaborer et de contribuer à des projets qui associent réflexion et nouvelles technologies.",
  },
  skills: {
    title: "Compétences",
    stackTitle: "Stack",
    rows: {
      languages: "Langages",
      frontend: "Frontend",
      backend: "Backend",
      tools: "Outils",
      learning: "Apprentissage",
    },
    pills: {
      restApi: "API REST",
      agenticAi: "IA agentique",
    },
    certificationsTitle: "Certifications",
    certifications: {
      webMobile: {
        title: "Développeur web et web mobile",
        detail: "Titre RNCP-37674, niveau 5",
        status: "Obtenu en 2026",
      },
      aiDeveloper: {
        title: "Développeur en intelligence artificielle",
        detail: "Titre RNCP-37827, niveau 6. Wild Code School, Paris.",
        status: "En préparation, 2026-2028",
      },
    },
  },
  projects: {
    title: "Projets",
    viewAll: "Voir tous les projets",
    theProject: "Le projet",
    howBuilt: "Sa construction",
    viewRepo: "Voir le dépôt GitHub",
    repoShort: "GitHub",
    screenshotPlaceholder: "Capture d'écran du projet",
    team: {
      team: "Projet d'équipe",
      solo: "Projet solo",
    },
    items: {
      wedoo: {
        type: "Application web",
        summary:
          "Application web de gestion et de création d'événements, présentée pour le titre de développeur web et web mobile.",
        build:
          "J'ai développé tout le système de signalement, du formulaire utilisateur au traitement par l'administrateur, côté front et back.",
      },
      pokeGacha: {
        type: "Jeu web, en cours",
        summary:
          "Jeu web de collection Pokémon\u00a0: joueurs, collection, équipes, objets et évolutions.",
        build:
          "Base conçue en MCD Merise, puis schéma MySQL avec contraintes d'intégrité. API Express et interface React, en TypeScript.",
      },
      project3: {
        type: "[Type du projet 3]",
        summary: "[Résumé du projet 3]",
        build: "[Construction du projet 3]",
      },
      project4: {
        type: "[Type du projet 4]",
        summary: "[Résumé du projet 4]",
        build: "[Construction du projet 4]",
      },
      project5: {
        type: "[Type du projet 5]",
        summary: "[Résumé du projet 5]",
        build: "[Construction du projet 5]",
      },
    },
  },
  about: {
    title: "À propos de moi",
    hook: "Après dix années dans l'audiovisuel comme assistant réalisateur,\nj'ai troqué mes feuilles de service contre du code.",
    paragraphs: [
      "J'y ai appris à transformer une vision en réalité, à coordonner des équipes aux expertises variées et à mener des projets ambitieux jusqu'à leur aboutissement.",
      "Aujourd'hui, j'applique cette même logique au développement web\u00a0: comprendre un besoin, concevoir une solution et résoudre les problèmes pour donner naissance à des applications fonctionnelles et accessibles.",
      "En parallèle, j'approfondis actuellement mes compétences en intelligence artificielle, avec l'envie d'intégrer ses possibilités au développement d'applications utiles et pertinentes.",
    ],
    closing: "Ce qui m'anime reste inchangé\u00a0: ",
    closingEmphasis: "donner vie aux idées.",
    softSkillsTitle: "Soft Skills",
    softSkills: {
      adaptability: "Adaptabilité",
      analyticalThinking: "Esprit analytique",
      prioritization: "Gestion des priorités",
      debugging: "Debugging",
      fastLearner: "Apprentissage rapide",
      initiative: "Prise d'initiative",
      agile: "Méthodes agiles (Scrum)",
      autonomy: "Autonomie",
      productCollaboration: "Collaboration produit",
      userUnderstanding: "Compréhension des utilisateurs",
    },
    clientsTitle: "Productions & collaborations qui m'ont fait confiance",
    pauseClients: "Mettre en pause le carrousel des logos",
    playClients: "Reprendre le carrousel des logos",
  },
  contact: {
    titleQuestion: "Un projet en tête\u00a0?",
    titleInvite: "Parlons-en.",
    intro: "Décrivez-le en quelques lignes, je vous réponds par e-mail.",
    fields: {
      name: "Nom",
      email: "Adresse e-mail",
      message: "Description du projet",
    },
    submit: "Envoyer ma demande",
    sending: "Envoi en cours…",
    errors: {
      required: "Ce champ est obligatoire.",
      invalidEmail: "Saisissez une adresse e-mail valide.",
    },
    success: "Message envoyé. Je vous réponds par e-mail.",
    failure: "L'envoi a échoué. Réessayez dans un instant.",
  },
  projectsPage: {
    backToHome: "Retour",
    title: "Tous les projets",
  },
};
