#  Yëkëni — African Family Genealogy Platform

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
  <img src="https://img.shields.io/badge/Status-Beta-blue" />
  <img src="https://img.shields.io/badge/IA-Claude%20Anthropic-blueviolet" />
  <img src="https://img.shields.io/badge/Langues-FR%20%7C%20WO%20%7C%20FUL%20%7C%20SRR-brightgreen" />
  <img src="https://img.shields.io/badge/Made%20in-Sénégal%20🇸🇳-green" />
</p>

🌐 **Site en ligne** : [yekeni.vercel.app](https://yekeni.vercel.app)

---

## 📌 Contexte & Problématique

En Afrique, des millions de familles perdent chaque jour une partie de leur histoire. Les plateformes de généalogie étrangères comme **Ancestry.com** ou **23andMe** collectent et monétisent les données ADN et familiales des Africains sans consentement réel.

> *"Ancestry.com connaît mieux la généalogie africaine que les Africains eux-mêmes — Yëkëni est là pour changer ça."*

**Yëkëni** (mot Wolof signifiant **"se reconnaître"**) propose une alternative **souveraine, locale et culturellement adaptée** à la réalité africaine.

---

## 🎯 Ce que Yëkëni résout

| Problème | Solution Yëkëni |
|---|---|
| 🕵️ Espionnage culturel par plateformes étrangères | **Données sécurisées** sur Supabase avec RLS (Row Level Security) |
| 🌍 Déracinement des Africains de la diaspora | Section **"Mes Racines"** avec villages, ethnies, langues |
| 📖 Disparition des traditions orales | **Mémoire familiale** interactive avec histoires et traditions |
| 🗣️ Barrière linguistique | Support **Français, Wolof, Pulaar, Sérère** |
| 🩺 Perte des données médicales familiales | **Fiche santé** par membre (groupe sanguin, allergies, antécédents) |

---

## ✨ Fonctionnalités Actuelles (MVP)

### 🌳 Arbre Généalogique Interactif
- ✅ Navigation interactive entre membres (père → grand-père → arrière-grand-père...)
- ✅ Ajout de relations : père, mère, frères, sœurs, enfants, conjoint
- ✅ Modification et suppression de membres
- ✅ Upload de photos de profil
- ✅ Fil d'Ariane pour se repérer
- ✅ Recherche par nom
- ✅ **Biographies générées par IA** (Claude Anthropic)

### 🌍 Mes Racines
- ✅ Origine ethnique (Peul, Wolof, Sérère, Mandingue, Diola...)
- ✅ Village et région d'origine
- ✅ Langues parlées
- ✅ Visualisation des ethnies et langues de la famille
- ✅ **Sauvegardé sur Supabase** — accessible depuis tous les appareils

### 👥 Gestion des Membres
- ✅ Informations personnelles : nom, profession, ville, pays
- ✅ Données de santé : groupe sanguin, allergies, maladies héréditaires
- ✅ **Sauvegardé sur Supabase** — partagé avec toute la famille

### 📸 Mémoire Familiale
- ✅ Souvenirs avec catégories (mariage, naissance, diplôme...)
- ✅ Traditions culturelles et religieuses
- ✅ Timeline interactive
- ✅ Système de likes

### 🎂 Événements Familiaux
- ✅ Calendrier interactif avec icônes personnalisées
- ✅ Alertes automatiques (rouge si moins de 7 jours)
- ✅ **Sauvegardé sur Supabase** — visible par toute la famille

### 👑 Système de Gouvernance Familiale
- ✅ **Admin principal** — chef de famille avec tous les droits
- ✅ **Co-Admins** (max 2) — gèrent la famille en cas d'absence de l'Admin
- ✅ **Transfert d'Admin** — avec confirmation
- ✅ **Membres** — accès standard
- ✅ **Invités** — accès limité en lecture seule

### 🔔 Notifications Familiales
- ✅ Alertes pour les activités familiales
- ✅ Badge de notifications non lues
- ✅ Panneau latéral animé

### 📄 Rapport Familial PDF
- ✅ Export PDF professionnel complet (5 pages)
- ✅ Page de couverture avec statistiques
- ✅ Liste des membres avec alertes santé

### Autres Fonctionnalités
| Fonctionnalité | Statut |
|---|---|
| 🗺️ Carte mondiale des membres | ✅ Actif |
| 📊 Statistiques familiales | ✅ Actif |
| 🔐 Authentification Supabase | ✅ Actif |
| 🩺 Historique médical familial | ✅ Actif |
| 📄 Rapport PDF complet | ✅ Actif |

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|---|---|---|
| **React.js** | 18.x | Framework frontend |
| **Supabase** | — | Backend, BDD PostgreSQL, Auth |
| **Vercel** | — | Déploiement et hébergement |
| **Leaflet + React-Leaflet** | 4.x | Carte interactive |
| **Recharts** | 2.x | Graphiques |
| **jsPDF + jspdf-autotable** | 2.x | Génération de rapports PDF |
| **Claude AI (Anthropic)** | Sonnet | Biographies IA |

---

## 🗄️ Architecture Base de Données (Supabase)

```
profils        → Comptes utilisateurs et rôles (admin/modérateur/membre/invité)
membres        → Individus de l'arbre généalogique
arbre          → Relations entre membres (parent/enfant/conjoint/fratrie)
racines        → Origines ethniques et régionales
evenements     → Événements familiaux (naissances, mariages, etc.)
notifications  → Système de notifications internes
```

Sécurité : **Row Level Security (RLS)** activée sur toutes les tables — seuls les membres validés par un admin peuvent accéder aux données.

---

## 🚀 Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) >= 16
- npm >= 8
- Un compte [Supabase](https://supabase.com)

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/gningueantou-sys/Y-k-ni.git
cd Y-k-ni

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
# Crée un fichier .env à la racine avec :
REACT_APP_SUPABASE_URL=ton_project_url
REACT_APP_SUPABASE_ANON_KEY=ta_anon_key

# 4. Lancer en développement
npm start
```

✅ L'application s'ouvre automatiquement sur [http://localhost:3000](http://localhost:3000)

---

## 🌍 Langues Supportées

| Langue | Code | Statut |
|---|---|---|
| 🇫🇷 Français | `fr` | ✅ Complet |
| 🇸🇳 Wolof | `wo` | ✅ Interface |
| 🇸🇳 Pulaar | `ful` | 🔄 En cours |
| 🇸🇳 Sérère | `srr` | 🔄 En cours |

---

## 🗺️ Roadmap

### Phase 1 : MVP ✅ (Juin 2025)
- [x] Arbre généalogique interactif
- [x] Système de gouvernance (Admin/Co-Admin/Transfert)
- [x] Notifications familiales
- [x] Rapport PDF complet
- [x] Biographies générées par IA

### Phase 2 : Backend ✅ (Juillet 2025)
- [x] Migration vers Supabase (auth, membres, racines, événements)
- [x] Row Level Security (RLS)
- [x] Déploiement sur Vercel
- [x] Authentification réelle (email/mot de passe)

### Phase 3 : Expansion (2025-2026)
- [ ] Synchronisation complète de l'arbre généalogique
- [ ] Application mobile (React Native)
- [ ] Reconnaissance faciale
- [ ] Intégration données ADN (optionnelle)

---

## 🏆 Hackathons & Compétitions

| Compétition | Thème | Pertinence |
|---|---|---|
| 🏅 **AIMS Senegal Hackathon** | Innovation scientifique africaine | ⭐⭐⭐⭐⭐ |
| 🏅 **Hackathon iSAFE** | Souveraineté numérique & IA | ⭐⭐⭐⭐⭐ |
| 🏅 **ID4Africa Hackathon** | Identité numérique africaine | ⭐⭐⭐⭐⭐ |
| 🏅 **Orange Social Venture Prize** | Impact social en Afrique | ⭐⭐⭐⭐ |

---

## 👨‍💻 Développeur

**Pape Antou Gningue**
- 🎓 Étudiant en L1 Informatique
- 📍 Dakar, Sénégal
- 🌐 GitHub : [@gningueantou-sys](https://github.com/gningueantou-sys)

---

## 📄 Licence

Ce projet est sous licence **MIT** — voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- Anthropic pour Claude Sonnet (biographies IA)
- Supabase pour le backend open source
- React community pour les outils extraordinaires
- Les familles sénégalaises qui testent et donnent des retours

---

<p align="center">
  <strong>Fait avec ❤️ au Sénégal · © 2025 Yëkëni</strong><br/>
  <em>Préservons ensemble l'héritage culturel africain</em>
</p>
