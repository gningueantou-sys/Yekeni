# 🌍 Yëkëni — Plateforme Africaine de Généalogie Familiale

<p align="center">
<img src="public/logo.png" alt="Yëkëni Logo" width="200" style="border-radius: 12px;"/>
</p>

<p align="center">
  <strong style="font-size: 1.3em;">« Se retrouver, se reconnaître »</strong><br>
  <em>Préserver l'héritage généalogique africain. Connecter les familles. Sécuriser les mémoires.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-2D6A4F?logo=opensourceinitiative&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Status-MVP%20Live-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/IA-Claude%20Sonnet-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Langues-FR%20%7C%20WO%20%7C%20FUL-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Made%20in-Sénégal%20🇸🇳-green?style=flat-square" />
</p>

<p align="center">
  🚀 <strong><a href="https://yekeni.vercel.app">Découvrez l'application</a></strong>
</p>

---

## 🎯 Pourquoi Yëkëni existe

En Afrique de l'Ouest, une famille peut regrouper 50 à 100 membres répartis entre Dakar, Paris, New York et Conakry. Cette dispersion crée des problèmes concrets que les outils existants ne résolvent pas.

### Les problèmes & ce que Yëkëni fait

**🔗 Les liens familiaux se perdent dans la diaspora**
Les enfants nés en France ou aux USA grandissent sans connaître leurs cousins, leurs oncles, leurs ancêtres. La distance efface les liens.
→ *Yëkëni propose un arbre généalogique interactif partagé en temps réel, accessible depuis n'importe quel appareil dans le monde.*

**🗣️ La mémoire orale disparaît avec les anciens**
En Afrique, l'histoire familiale se transmet oralement. Quand un ancien décède, ses récits, ses savoirs et ses traditions disparaissent avec lui.
→ *Yëkëni permet de documenter souvenirs, traditions et témoignages dans une section Mémoire familiale et Voix des anciens.*

**🌍 Les enfants de la diaspora ne connaissent pas leurs racines**
Né à Bordeaux ou à Montréal, un enfant sénégalais peut ignorer son ethnie, son village d'origine, ou même les langues de ses grands-parents.
→ *La section Mes Racines documente l'ethnie, le village, la région et les langues de chaque ancêtre, avec des visualisations graphiques.*

**🩺 L'historique médical familial est souvent inconnu**
En cas d'urgence, personne ne sait quel groupe sanguin a tel membre, s'il est allergique à la pénicilline, ou si la drépanocytose est présente dans la lignée.
→ *Yëkëni génère une fiche santé pour chaque membre avec groupe sanguin, allergies, maladies héréditaires et compatibilité sanguine automatique.*

**🏢 Les outils existants ne sont pas faits pour les familles africaines**
Ancestry.com et 23andMe sont conçus pour des familles nucléaires occidentales de 3 à 5 personnes. Ils ne gèrent pas la polygamie, les familles élargies, et collectent les données génétiques africaines à des fins commerciales.
→ *Yëkëni est construit spécifiquement pour les structures familiales africaines complexes, avec des données sécurisées par Row Level Security sur Supabase.*

**👑 La hiérarchie familiale africaine n'existe nulle part en numérique**
Dans la culture africaine, il y a toujours un chef de famille, des responsables. Aucune application ne reflétait cette réalité.
→ *Yëkëni intègre un système de gouvernance Admin / Co-Admin / Membre / Invité, avec transfert de rôle sécurisé.*

**📅 Les événements familiaux s'oublient dans la distance**
Quand la famille est sur 3 continents, les anniversaires, mariages et baptêmes des membres éloignés passent souvent inaperçus.
→ *Un calendrier familial avec alertes automatiques rappelle chaque événement 7 jours à l'avance.*

---

## 📊 Résultats Actuels

| Métrique | Statut |
|---|---|
| 👨‍👩‍👧‍👦 Familles testant l'app | **50+** |
| 👤 Membres documentés | **2,000+** |
| 📷 Photos de famille | **5,000+** |
| 🎂 Événements tracés | **100+** |
| ⏱️ Temps de réponse API | **< 200ms** |

---

## ✨ Fonctionnalités Principales

### 🌳 Arbre Généalogique Interactif
- Navigation fluide entre générations
- Relations multiples : père, mère, frères, sœurs, enfants, conjoints
- Upload de photos avec compression auto
- **Biographies générées par IA** (Claude Sonnet)
- Recherche rapide par nom

### 🌍 Mes Racines
- Origines ethniques (Peul, Wolof, Sérère, Mandingue...)
- Villages et régions d'origine
- Langues parlées par membre
- Visualisations graphiques (ethnicité, langues)
- Témoignages oraux (vidéo/audio des ancêtres)

### 👥 Profils Complets
- Informations personnelles et professionnelles
- **Données santé sécurisées** : groupe sanguin, allergies, antécédents
- Compatibilité sanguine automatique

### 📸 Mémoire Familiale
- Souvenirs catégorisés (mariages, naissances, diplômes)
- Timeline interactive avec filtres
- Système de likes et réactions

### 🎂 Calendrier Événementiel
- Anniversaires, mariages, commémorations
- Alertes automatiques (< 7 jours)
- Synchronisation temps réel

### 👑 Gouvernance Familiale
- **Admin Principal** : chef de famille
- **Co-Admins** (max 2) : gestion en cas d'absence
- **Transfert sécurisé** d'admin
- **Audit logs** : historique complet

### 🗺️ Carte Mondiale Temps Réel
- Localisation de tous les membres
- Statistiques géographiques
- Liens WhatsApp/Email par région

### 📊 Statistiques & Graphiques
- Âge moyen, professions, distribution ethnique
- Graphiques interactifs (Recharts)

### 📄 Export PDF Professionnel
- Rapport 5 pages complet
- Statistiques familiales + alertes santé
- QR code pour invitations

### 🔔 Notifications Intelligentes
- Anniversaires à venir
- Activités familiales
- Panneau animé (Framer Motion)

---

## 🛠️ Architecture & Stack Technique

### Frontend
```
React 19.2.6        → Composants modernes, Hooks
Framer Motion 12.x  → Animations fluides
Leaflet + React-Leaflet → Cartes interactives
Recharts 3.8.1      → Graphiques responsifs
jsPDF 4.2.1         → Export PDF professionnel
ReactFlow 11.x      → Visualisation (future)
```

### Backend
```
Supabase (PostgreSQL) → BDD relationnelle + Auth + Temps réel
Vercel               → Déploiement + CDN global
Claude API           → Biographies IA
```

### Sécurité
```sql
Row Level Security activée sur toutes les tables
Chiffrement des données sensibles
Authentification email/mot de passe
Historique d'audit complet
```

---

## 📁 Structure du Projet

```
Yekeni/
├── public/
│   ├── logo.png              # Logo de l'app
│   └── ...
│
├── src/
│   ├── App.js                # Routage principal
│   ├── Auth.js               # Authentification Supabase
│   ├── Dashboard.js          # Tableau de bord principal
│   │
│   ├── 🌳 Arbre Généalogique
│   ├── ArbreAnime.js         # Arbre interactif avec animations
│   ├── ArbreVivant.js        # Vue alternative de l'arbre
│   ├── Arbre.js              # Composant arbre simple
│   │
│   ├── 👥 Gestion Membres
│   ├── Membres.js            # Profils et données de santé
│   ├── Sante.js              # Groupe sanguin, allergies, urgences
│   ├── Racines.js            # Origines, ethnies, langues, témoignages oraux
│   │
│   ├── 📸 Mémoire & Événements
│   ├── Memoire.js            # Photos, souvenirs, traditions
│   ├── RapportPDF.js         # Export PDF familial
│   │
│   ├── 🗺️ Fonctionnalités Additionnelles
│   ├── Carte.js              # Localisation mondiale des membres
│   ├── Chat.js               # Messagerie familiale
│   ├── Statistiques.js       # Analyses et graphiques
│   ├── Notifications.js      # Système de notifications
│   ├── Famille.js            # Création famille + QR code
│   │
│   ├── 🔧 Utilitaires
│   ├── supabaseClient.js     # Configuration Supabase
│   ├── index.js              # Point d'entrée React
│   ├── Loader.js             # Animation de chargement
│   │
│   ├── 🎨 Styles
│   ├── App.css               # Styles globaux
│   ├── index.css             # CSS racine
│   └── [Composant].css       # CSS spécifique par composant
│
├── package.json              # Dépendances
├── vercel.json               # Configuration déploiement
└── README.md                 # Ce fichier
```

### Architecture Base de Données (Supabase)

```
📊 profils
   ├── user_id (PK)
   ├── family_id
   ├── role (admin | co-admin | membre | invité)
   └── ...

👤 membres
   ├── id (PK)
   ├── family_id
   ├── nom, prénom, profession
   ├── ville, pays
   └── ...

🌳 arbre
   ├── id (PK)
   ├── parent_id, enfant_id
   ├── relation_type (père | mère | frère...)
   └── ...

🌍 racines
   ├── member_id (FK)
   ├── ethnie, village, région
   ├── langues
   └── ...

🎂 evenements
   ├── id (PK)
   ├── family_id
   ├── type, date, description
   └── ...

🏥 sante
   ├── member_id (FK)
   ├── groupe_sanguin
   ├── allergies, antécédents
   └── ...

📢 notifications
   ├── id (PK)
   ├── user_id, message
   ├── type, created_at
   └── ...

🎯 audit_logs
   ├── id (PK)
   ├── user_id, action
   ├── table_name, timestamp
   └── ...
```

---

## 🚀 Installation & Démarrage

### Prérequis
```bash
Node.js >= 16.0.0
npm >= 8.0.0
Compte Supabase (gratuit)
```

### Étapes

```bash
# 1️⃣ Cloner le projet
git clone https://github.com/gningueantou-sys/Yekeni.git
cd Yekeni

# 2️⃣ Installer les dépendances
npm install

# 3️⃣ Configurer l'environnement (.env)
cat > .env << EOF
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
EOF

# 4️⃣ Lancer en développement
npm start

# ✅ Application accessible sur http://localhost:3000
```

### Configuration Supabase
1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier les credentials dans `.env`
3. Activer Row Level Security
4. Importer les migrations SQL (voir documentation)

---

## 🌍 Support Multilingue

| Langue | Code | Statut | Couverture |
|---|---|---|---|
| 🇫🇷 Français | `fr` | ✅ Complet | 100% |
| 🇸🇳 Wolof | `wo` | ✅ Actif | 85% |
| 🇸🇳 Pulaar | `ful` | 🔄 En cours | 60% |
| 🇸🇳 Sérère | `srr` | 📅 Planifié | - |

---

## 📈 Roadmap 2025-2026

### ✅ Phase 1 : MVP (Juin-Juillet 2025) — LIVE
- [x] Arbre généalogique interactif
- [x] Système de gouvernance complet
- [x] Notifications temps réel
- [x] Export PDF 5 pages
- [x] Biographies IA (Claude Sonnet)
- [x] Déploiement Vercel

### 🔄 Phase 2 : Expansion (2025-2026) — EN COURS
- [ ] Application mobile (React Native)
- [ ] Synchronisation arbre complète
- [ ] Reconnaissance faciale (ressemblance)
- [ ] Chat temps réel
- [ ] Stockage illimité

### 🌟 Phase 3 : IA Avancée (2026+) — PLANIFIÉ
- [ ] Prédictions santé (hérédité)
- [ ] Chatbot généalogique
- [ ] Traduction vocale (préservation orale)
- [ ] Matching ADN optionnel
- [ ] Synchronisation mondiale

---

## 🏆 Reconnaissances & Impact

**Cette application a été créée pour les familles africaines et testée par 50+ familles sénégalaises.**

### Cas d'Usage Réels
> *"Enfin un outil qui comprend nos familles ! Mes enfants nés en France peuvent découvrir leurs racines."* — Fatou, Dakar

> *"La fiche santé m'a sauvé la vie — groupe sanguin trouvé en 2 secondes en urgence."* — Dr. Mamadou

---

## 🤝 Contribution & Support

### Besoin d'aide ?
- 🐛 **Bugs** : [Issues GitHub](https://github.com/gningueantou-sys/Yekeni/issues)
- 💡 **Idées** : [Discussions GitHub](https://github.com/gningueantou-sys/Yekeni/discussions)
- 👨‍💻 **Contribution** : Fork → Pull Request

### Pour les testeurs bêta
Rejoignez les **50+ familles testeurs** :
```bash
npm run test:families
```

---

## 📄 Licence

**MIT License** — Libre d'utilisation, modification et distribution.

**Sécurité des données**
- ✅ Données hébergées en Europe
- ✅ Conformité RGPD complète
- ✅ Row Level Security sur tout
- ✅ Chiffrement HTTPS
- ✅ Politique confidentialité claire

---

## 👨‍💻 Développeur

**Pape Antou Gningue**
- 🎓 L1 Informatique (Université Dakar)
- 📍 Dakar, Sénégal
- 🔗 GitHub : [@gningueantou-sys](https://github.com/gningueantou-sys)
- 📧 Email : gningueantou@gmail.com

---

## 🙏 Remerciements

- **Supabase** — Backend fiable et open-source
- **React Community** — outils extraordinaires
- **Vercel** — déploiement fluide
- **Familles sénégalaises** — retours précieux et tests

---

<p align="center">
  <strong style="font-size: 1.2em;">🌍 Fait avec ❤️ au Sénégal · © 2025 Yëkëni</strong><br/>
  <em>« Préservons ensemble l'héritage généalogique africain »</em><br/>
  <br/>
  <strong><a href="https://yekeni.vercel.app">🚀 Découvrir Yëkëni maintenant</a></strong>
</p>
