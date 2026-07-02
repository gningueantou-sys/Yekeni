Yëkëni — Plateforme de Généalogie Familiale Africaine

<p align="center">
<img src="public/logo.png" alt="Yëkëni Logo" width="180"/>
</p>
<p align="center">
  <em>"Se retrouver, se reconnaître"</em>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React-18.0-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-2D6A4F?logo=opensourceinitiative&logoColor=white" />
  <img src="https://img.shields.io/badge/Made%20in-Sénégal%20🇸🇳-green" />
</p>
🌐 Site en ligne : yekeni.vercel.app


Pourquoi ce projet ?

En Afrique de l'Ouest, la famille est au centre de tout. Une seule famille peut regrouper plusieurs dizaines de membres répartis entre Dakar, Paris, New York et Conakry. Cette dispersion crée des problèmes concrets que j'ai voulu adresser :


Les enfants de la diaspora grandissent sans connaître leurs cousins, leurs ancêtres, leur village d'origine
Les traditions orales et les histoires familiales disparaissent avec les anciens
Personne ne sait qui est allergique à quoi, ou quel groupe sanguin a tel membre de la famille en cas d'urgence
Les structures familiales africaines sont complexes (polygamie, familles élargies) et les outils existants comme Ancestry.com ne sont pas adaptés


J'ai créé Yëkëni — qui signifie "se reconnaître" en Wolof — pour donner aux familles africaines un outil qui leur ressemble vraiment.


Ce que permet Yëkëni

Arbre généalogique interactif

Construire et naviguer dans l'arbre de sa famille sur plusieurs générations. On peut ajouter père, mère, frères, sœurs, enfants et conjoints, uploader des photos, et même générer automatiquement une biographie pour chaque membre grâce à l'IA.

Mes Racines

Documenter les origines culturelles de chaque ancêtre :


Origines — village, région, pays d'origine
Ethnies & Langues — composition ethnique de la famille (Peul, Wolof, Sérère...) et langues parlées
Voix des anciens — espace pour enregistrer et préserver les témoignages oraux


Membres

Un profil complet pour chaque membre de la famille avec ses informations personnelles et ses données de santé (groupe sanguin, allergies, maladies héréditaires).

Mémoire familiale

Garder une trace des souvenirs importants (mariages, naissances, diplômes...), des traditions et de l'histoire de la famille. Avec une timeline interactive et un système de likes.

Événements

Un calendrier des événements familiaux avec des alertes automatiques quand une date approche.

Autres fonctionnalités


Carte mondiale pour voir où vivent les membres de la famille
Chat familial pour rester connecté
Fiches santé avec compatibilité sanguine
Statistiques familiales
Export PDF complet
Notifications familiales
Système de gouvernance (Admin, Co-Admin, Membre, Invité)



Stack technique

TechnologieUsageReact.jsFrontendSupabaseBase de données PostgreSQL + AuthentificationVercelHébergementLeafletCarte interactiveRechartsGraphiquesjsPDFExport PDFClaude API (Anthropic)Génération de biographies


Base de données (Supabase)

profils       → comptes utilisateurs et rôles
membres       → individus de l'arbre généalogique
arbre         → relations entre membres
racines       → origines ethniques et régionales
evenements    → événements familiaux
notifications → notifications internes

Row Level Security activée sur toutes les tables.


Structure du projet

src/
├── App.js            → Page d'accueil publique
├── Auth.js           → Connexion et inscription (Supabase)
├── Dashboard.js      → Tableau de bord principal
├── ArbreAnime.js     → Arbre généalogique interactif
├── Membres.js        → Gestion des profils membres
├── Racines.js        → Origines / Ethnies & Langues / Voix des anciens
├── Memoire.js        → Souvenirs / Traditions / Histoire familiale
├── Sante.js          → Fiches santé / Compatibilité sanguine / Urgences
├── Carte.js          → Carte mondiale des membres
├── Chat.js           → Messagerie familiale
├── Statistiques.js   → Graphiques et analyses
├── Notifications.js  → Panneau de notifications
├── Famille.js        → Création de famille + code QR
├── Loader.js         → Animation de chargement
└── supabaseClient.js → Connexion à Supabase


Installation

bashgit clone https://github.com/gningueantou-sys/Y-k-ni.git
cd Y-k-ni
npm install

Crée un fichier .env à la racine :

REACT_APP_SUPABASE_URL=ton_url_supabase
REACT_APP_SUPABASE_ANON_KEY=ta_clé_anon

bashnpm start


Objectifs du projet


Créer une application web complète et fonctionnelle de généalogie familiale
Adapter l'outil aux réalités des familles africaines (familles élargies, polygamie, diaspora)
Préserver la mémoire et les traditions culturelles africaines
Faciliter la communication entre membres de la famille dispersés dans le monde
Documenter les données de santé familiale de manière sécurisée



Langues supportées

Français, Wolof — Pulaar et Sérère en cours d'intégration.


Développeur

Pape Antou Gningue — Étudiant en L1 Informatique, Dakar, Sénégal
GitHub : @gningueantou-sys


Remerciements

Merci aux familles sénégalaises qui ont testé et donné des retours, à la communauté React, et à Supabase pour leur backend open source.


Fait avec ❤️ au Sénégal · © 2025 Yëkëni
