# 🌍 Yëkëni — Plateforme Africaine de Généalogie Familiale

<p align="center">
<img src="public/logo.png" alt="Yëkëni Logo" width="200"/>
</p>

<p align="center">
  <strong>« Se retrouver, se reconnaître »</strong><br>
  <em>Préserver l'héritage généalogique africain. Connecter les familles. Sécuriser les mémoires.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.0-61DAFB?logo=react&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-2D6A4F?logo=opensourceinitiative&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Langues-FR%20%7C%20WO%20%7C%20FUL-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Made%20in-Sénégal%20🇸🇳-green?style=flat-square" />
</p>

<p align="center">
  🚀 <strong><a href="https://yekeni.vercel.app">Découvrez l'application</a></strong>
</p>

---

## ⚡ Démarrage Rapide

| Étape | Action |
|---|---|
| **1** | `git clone https://github.com/gningueantou-sys/Yekeni.git` |
| **2** | `cd Yekeni && npm install` |
| **3** | Créer `.env` avec les credentials Supabase |
| **4** | `npm start` |
| **✅** | Ouvrir http://localhost:3000 |

---

## 🎯 Pourquoi Yëkëni existe

En Afrique de l'Ouest, une famille peut regrouper 50 à 100 membres répartis entre Dakar, Paris, New York et Conakry. Cette dispersion crée des problèmes concrets que les outils existants ne résolvent pas.

**🔗 Les liens familiaux se perdent dans la diaspora**
Les enfants nés en France ou aux USA grandissent sans connaître leurs cousins, leurs oncles, leurs ancêtres. La distance efface les liens.
→ *Yëkëni propose un arbre généalogique interactif partagé en temps réel, accessible depuis n'importe quel appareil dans le monde.*

**🗣️ La mémoire orale disparaît avec les anciens**
En Afrique, l'histoire familiale se transmet oralement. Quand un ancien décède, ses récits et ses traditions disparaissent avec lui.
→ *Yëkëni permet de documenter souvenirs, traditions et témoignages dans une section Mémoire familiale et Voix des anciens.*

**🌍 Les enfants de la diaspora ne connaissent pas leurs racines**
Né à Bordeaux ou à Montréal, un enfant sénégalais peut ignorer son ethnie, son village d'origine, ou les langues de ses grands-parents.
→ *La section Mes Racines documente l'ethnie, le village, la région et les langues de chaque ancêtre.*

**🩺 L'historique médical familial est souvent inconnu**
En cas d'urgence, personne ne sait quel groupe sanguin a tel membre, s'il est allergique à la pénicilline, ou si la drépanocytose est présente dans la lignée.
→ *Yëkëni génère une fiche santé pour chaque membre avec groupe sanguin, allergies et compatibilité sanguine automatique.*

**🏢 Les outils existants ne sont pas faits pour les familles africaines**
Ancestry.com et 23andMe sont conçus pour des familles nucléaires occidentales. Ils ne gèrent pas la polygamie ni les familles élargies.
→ *Yëkëni est construit spécifiquement pour les structures familiales africaines complexes, avec des données sécurisées par Row Level Security.*

**👑 La hiérarchie familiale africaine n'existe nulle part en numérique**
Dans la culture africaine, il y a toujours un chef de famille. Aucune application ne reflétait cette réalité.
→ *Yëkëni intègre un système de gouvernance Admin / Co-Admin / Membre / Invité, avec transfert de rôle sécurisé.*

**📅 Les événements familiaux s'oublient dans la distance**
Quand la famille est sur 3 continents, les anniversaires et mariages des membres éloignés passent souvent inaperçus.
→ *Un calendrier familial avec alertes automatiques rappelle chaque événement 7 jours à l'avance.*

---

## ✨ Fonctionnalités

### 🌳 Arbre Généalogique Interactif
- Navigation fluide entre générations
- Relations multiples : père, mère, frères, sœurs, enfants, conjoints
- Upload de photos de profil
- **Biographies générées par IA** (Claude Sonnet)
- Recherche rapide par nom

### 🌍 Mes Racines
- Origines ethniques (Peul, Wolof, Sérère, Mandingue...)
- Villages et régions d'origine
- Langues parlées par membre
- Visualisations graphiques (ethnicité, langues)
- Témoignages oraux des ancêtres

### 👥 Profils Membres
- Informations personnelles et professionnelles
- **Données santé sécurisées** : groupe sanguin, allergies, antécédents
- Compatibilité sanguine automatique

### 📸 Mémoire Familiale
- Souvenirs catégorisés (mariages, naissances, diplômes)
- Timeline interactive
- Système de likes

### 🎂 Événements Familiaux
- Anniversaires, mariages, commémorations
- Alertes automatiques à 7 jours
- Sauvegardé sur Supabase

### 👑 Gouvernance Familiale
- **Admin Principal** : chef de famille
- **Co-Admins** (max 2) : gestion en cas d'absence
- **Transfert sécurisé** d'admin

### Autres
- 🗺️ Carte mondiale des membres
- 📊 Statistiques et graphiques
- 💬 Chat familial
- 📄 Export PDF complet (5 pages)
- 🔔 Notifications familiales

---

## 🛠️ Stack Technique

### Frontend
```
React 18.x              → Framework principal
Leaflet + React-Leaflet → Carte interactive
Recharts                → Graphiques
jsPDF                   → Export PDF
```

### Backend
```
Supabase (PostgreSQL)   → Base de données + Auth
Vercel                  → Déploiement
Claude API (Anthropic)  → Biographies IA
```

### Sécurité
```
Row Level Security sur toutes les tables
Authentification email/mot de passe
HTTPS obligatoire
```

---

## 📁 Structure du Projet

```
src/
├── App.js              → Routage principal
├── Auth.js             → Authentification Supabase
├── Dashboard.js        → Tableau de bord principal
├── ArbreAnime.js       → Arbre généalogique interactif
├── Membres.js          → Profils membres
├── Sante.js            → Fiches santé
├── Racines.js          → Origines / Ethnies / Voix des anciens
├── Memoire.js          → Souvenirs / Traditions / Histoire
├── Carte.js            → Carte mondiale
├── Chat.js             → Messagerie familiale
├── Statistiques.js     → Graphiques et analyses
├── Notifications.js    → Panneau de notifications
├── Famille.js          → Création famille + QR code
├── RapportPDF.js       → Export PDF
├── Loader.js           → Animation de chargement
└── supabaseClient.js   → Connexion Supabase
```

### Base de Données (Supabase)

```
profils       → comptes utilisateurs et rôles
membres       → individus de l'arbre
arbre         → relations entre membres
racines       → origines ethniques et régionales
evenements    → événements familiaux
notifications → notifications internes
```

---

## 🚀 Installation

### Prérequis
```
Node.js >= 16.0.0
npm >= 8.0.0
Compte Supabase (gratuit)
```

### Étapes

```bash
# Cloner le projet
git clone https://github.com/gningueantou-sys/Yekeni.git
cd Yekeni

# Installer les dépendances
npm install

# Créer le fichier .env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Lancer
npm start
```

---

## 💻 Exemples de Code

### Ajouter un membre

```javascript
const { data, error } = await supabase
  .from('membres')
  .insert([{
    nom: memberData.nom,
    prenom: memberData.prenom,
    lieu_naissance: memberData.ville,
    cree_par: user.id
  }])
  .select();
```

### Générer une biographie avec l'IA

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Écris une biographie courte pour ${membre.prenom} ${membre.nom}, 
      originaire de ${membre.ville}, profession : ${membre.profession}.
      Contexte : famille africaine.`
    }]
  })
});
```

### Compatibilité sanguine

```javascript
const compatibility = {
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB+': ['AB+'],
  'O-': ['Tous les groupes'],
};

function getCompatibleTypes(bloodType) {
  return compatibility[bloodType] || [];
}
```

---

## 🌍 Langues Supportées

| Langue | Statut |
|---|---|
| 🇫🇷 Français | ✅ Complet |
| 🇸🇳 Wolof | ✅ Interface |
| 🇸🇳 Pulaar | 🔄 En cours |
| 🇸🇳 Sérère | 📅 Planifié |

---

## 📈 Roadmap

### ✅ Phase 1 — MVP (Juin-Juillet 2025)
- [x] Arbre généalogique interactif
- [x] Système de gouvernance
- [x] Export PDF
- [x] Biographies IA
- [x] Migration Supabase
- [x] Déploiement Vercel

### 🔄 Phase 2 — Expansion
- [ ] Application mobile (React Native)
- [ ] Synchronisation arbre complète
- [ ] Chat temps réel

### 🌟 Phase 3 — IA Avancée
- [ ] Chatbot généalogique
- [ ] Traduction vocale
- [ ] Matching ADN optionnel

---

## ❓ FAQ

**Q : Mes données sont-elles sécurisées ?**
Oui. Row Level Security est activée sur toutes les tables Supabase. Seuls les membres validés par un admin peuvent accéder aux données.

**Q : L'app fonctionne-t-elle sans connexion ?**
Partiellement. L'arbre et les données locales fonctionnent hors ligne, mais la synchronisation Supabase nécessite une connexion.

**Q : Comment rejoindre une famille existante ?**
Via le code famille unique généré à la création, ou en demandant à l'admin de vous inviter.

**Q : Erreur page blanche sur Vercel ?**
Vérifiez que les variables `REACT_APP_SUPABASE_URL` et `REACT_APP_SUPABASE_ANON_KEY` sont bien configurées dans les Environment Variables de Vercel.

---

## 👨‍💻 Développeur

**Pape Antou Gningue**
- 🎓 L1 Informatique — Dakar, Sénégal
- 🔗 GitHub : [@gningueantou-sys](https://github.com/gningueantou-sys)
- 📧 gningueantou@gmail.com

---

## 🙏 Remerciements

- **Supabase** — backend open source
- **Vercel** — déploiement gratuit
- **React Community** — outils extraordinaires
- **Familles sénégalaises** — retours et tests

---

<p align="center">
  <strong>🌍 Fait avec ❤️ au Sénégal · © 2025 Yëkëni</strong><br/>
  <em>« Préservons ensemble l'héritage généalogique africain »</em><br/><br/>
  <strong><a href="https://yekeni.vercel.app">🚀 Découvrir Yëkëni</a></strong>
</p>