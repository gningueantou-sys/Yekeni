#  Yëkëni — African Family Genealogy Platform

<p align="center">
  <img src="public/logo.svg" alt="Yëkëni Logo" width="180"/>
</p>

<p align="center">
  <em>"Se retrouver, se reconnaître"</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.0-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-2D6A4F?logo=opensourceinitiative&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Beta%20(PWA)-blue" />
  <img src="https://img.shields.io/badge/IA-Claude%20Anthropic-blueviolet" />
  <img src="https://img.shields.io/badge/Langues-FR%20%7C%20WO%20%7C%20FUL%20%7C%20SRR-brightgreen" />
  <img src="https://img.shields.io/badge/Made%20in-Sénégal%20🇸🇳-green" />
</p>

---

## 📌 Contexte & Problématique

En Afrique, des millions de familles perdent chaque jour une partie de leur histoire. Les plateformes de généalogie étrangères comme **Ancestry.com** ou **23andMe** collectent et monétisent les d[...]

> *"Ancestry.com connaît mieux la généalogie africaine que les Africains eux-mêmes — Yëkëni est là pour changer ça."*

**Yëkëni** (mot Wolof signifiant **"se reconnaître"**) propose une alternative **souveraine, locale et culturellement adaptée** à la réalité africaine.

---

## 🎯 Ce que Yëkëni résout

| Problème | Solution Yëkëni |
|---|---|
| 🕵️ Espionnage culturel par plateformes étrangères | **Données 100% locales** — stockées dans votre appareil, jamais envoyées à l'étranger |
| 🌍 Déracinement des Africains de la diaspora | Section **"Mes Racines"** avec villages, ethnies, langues |
| 📖 Disparition des traditions orales | **Mémoire familiale** interactive avec histoires et traditions |
| 🗣️ Barrière linguistique | Support **Français, Wolof, Pulaar, Sérère** |
| 🩺 Perte des données médicales familiales | **Fiche santé** par membre (groupe sanguin, allergies, antécédents) |

---

## ✨ Fonctionnalités Actuelles (MVP)

### 🌳 Arbre Généalogique Interactif
> Construisez et explorez votre généalogie sur plusieurs générations

- ✅ Navigation interactive entre membres (père → grand-père → arrière-grand-père...)
- ✅ Ajout de relations : père, mère, frères, sœurs, enfants, conjoint
- ✅ Modification et suppression de membres
- ✅ Upload de photos de profil
- ✅ Fil d'Ariane pour se repérer
- ✅ Recherche par nom
- ✅ **Biographies générées par IA** (Claude Anthropic)
- ✅ Sauvegarde automatique en local

### 🌍 Mes Racines
> Documentez les origines culturelles de chaque ancêtre

- ✅ Origine ethnique (Peul, Wolof, Sérère, Mandingue, Diola...)
- ✅ Village et région d'origine
- ✅ Langues parlées
- ✅ Visualisation des ethnies et langues de la famille

### 👥 Gestion des Membres
> Un profil complet pour chaque membre

- ✅ Informations personnelles : nom, profession, ville, pays
- ✅ Données de santé : groupe sanguin, allergies, maladies héréditaires
- ✅ Recherche et filtrage avancés

### 📸 Mémoire Familiale
> Préservez l'histoire pour les générations futures

- ✅ Souvenirs avec catégories (mariage, naissance, diplôme...)
- ✅ Traditions culturelles et religieuses
- ✅ Timeline interactive
- ✅ Système de likes

### 🎂 Événements Familiaux
> Calendrier et rappels

- ✅ Calendrier interactif avec icônes personnalisées
- ✅ Alertes automatiques (rouge si moins de 7 jours)
- ✅ Compteur de jours restants

### Autres Fonctionnalités
| Fonctionnalité | Statut |
|---|---|
| 🗺️ Carte mondiale des membres | ✅ Actif |
| 📊 Statistiques familiales | ✅ Actif |
| 🔑 Code famille pour l'accès sécurisé | ✅ Actif |
| 🩺 Historique médical familial | ✅ Actif |

---

## 🛡️ Souveraineté & Sécurité des Données

### Engagements
| Engagement | Détail |
|---|---|
| ✅ **Données 100% locales** | Stockées uniquement dans votre navigateur (localStorage). Zéro serveur externe. |
| ✅ **Zéro monétisation** | Vos données ne sont jamais vendues, partagées ou analysées. |
| ✅ **Accès sécurisé** | Code famille unique pour protéger vos données. |
| ✅ **Open Source** | Code transparent et auditable par tous. |
| ✅ **Hors ligne** | Fonctionne sans connexion Internet. |

### ⚠️ Limitations actuelles
- **localStorage** : Les données restent sur votre appareil. Si vous videz le cache, elles sont perdues.
- **Pas de synchronisation** : Chaque appareil a ses propres données. La sync multi-device arrive prochainement.
- **IA avec clé API** : Pour les biographies générées par IA, vous devez fournir votre propre clé API Claude (gratuite/payante selon usage).

---

## 🚀 Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) >= 16
- npm >= 8

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/gningueantou-sys/Yekeni.git

# 2. Entrer dans le dossier
cd Yekeni

# 3. Installer les dépendances
npm install

# 4. Lancer en développement
npm start
```

✅ L'application s'ouvre automatiquement sur [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du Projet

```
Yekeni/
├── src/
│   ├── 🏠 App.js / App.css
│   │   └─ Page d'accueil publique
│   ├── 🔐 Auth.js / Auth.css
│   │   └─ Authentification locale (code famille)
│   ├── 🏡 Famille.js / Famille.css
│   │   └─ Création de famille + code QR
│   ├── 📊 Dashboard.js / Dashboard.css
│   │   └─ Tableau de bord principal
│   ├── 🌳 ArbreAnime.js / ArbreAnime.css
│   │   └─ Arbre généalogique interactif
│   ├── 👥 Membres.js / Membres.css
│   │   └─ Gestion des profils
│   ├── 🌍 Racines.js / Racines.css
│   │   └─ Origines ethniques et langues
│   ├── 📸 Memoire.js / Memoire.css
│   │   └─ Souvenirs et traditions
│   ├── 🩺 Sante.js / Sante.css
│   │   └─ Données médicales
│   ├── 🗺️ Carte.js / Carte.css
│   │   └─ Localisation géographique
│   ├── 💬 Chat.js / Chat.css
│   │   └─ Messagerie familiale
│   ├── 📊 Statistiques.js / Statistiques.css
│   │   └─ Analyses et graphiques
│   └── ⚙️ index.js / index.css
└── public/
    ├── logo.svg
    └── logo-adn.svg
```

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|---|---|---|
| **React.js** | 18.x | Framework frontend |
| **Leaflet + React-Leaflet** | 4.x | Carte interactive |
| **Recharts** | 2.x | Graphiques |
| **Claude AI (Anthropic)** | Sonnet | Biographies IA |
| **localStorage** | — | Persistance locale |
| **CSS** | — | Design custom |

---

## 🌍 Langues Supportées

| Langue | Code | Statut |
|---|---|---|
| 🇫🇷 Français | `fr` | ✅ Complet |
| 🇸🇳 Wolof | `wo` | ✅ Interface |
| 🇸🇳 Pulaar | `ful` | 🔄 En cours |
| 🇸🇳 Sérère | `srr` | 🔄 En cours |

---

## 🗺️ Roadmap (6-12 mois)

### Phase 1 : Stabilité (Juillet - Septembre 2025)
- [ ] Exporter l'arbre en PDF
- [ ] Sauvegarde cloud optionnelle (avec chiffrement)
- [ ] Tests utilisateurs avec familles sénégalaises

### Phase 2 : Expansion (Octobre - Décembre 2025)
- [ ] Synchronisation multi-appareils
- [ ] Application mobile (React Native)
- [ ] Mode hors ligne amélioré

### Phase 3 : IA & Avancé (2026)
- [ ] Reconnaissance faciale simple
- [ ] Recommandations de liens familiaux
- [ ] Intégration données ADN (optionnelle)

---

## 🏆 Hackathons & Compétitions

Ce projet cible :

| Compétition | Thème | Pertinence |
|---|---|---|
| 🏅 **AIMS Senegal Hackathon** | Innovation scientifique africaine | ⭐⭐⭐⭐⭐ |
| 🏅 **Hackathon iSAFE** | Souveraineté numérique & IA | ⭐⭐⭐⭐⭐ |
| 🏅 **ID4Africa Hackathon** | Identité numérique africaine | ⭐⭐⭐⭐⭐ |
| 🏅 **Orange Social Venture Prize** | Impact social en Afrique | ⭐⭐⭐⭐ |

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Besoin d'aide ?
- 📖 **Documentation** : À venir
- 💬 **Questions** : Ouvrez une issue
- 🐛 **Bugs** : Signalez via GitHub Issues

---

## 👨‍💻 Développeur

**Pape Antou Gningue**
- 🎓 Étudiant en L1 Informatique
- 📍 Dakar, Sénégal
- 🌐 GitHub : [@gningueantou-sys](https://github.com/gningueantou-sys)
- 📧 Contactez-moi pour les partenariats ou questions

---

## 📄 Licence

Ce projet est sous licence **MIT** — voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- Anthropic pour Claude Sonnet (biographies IA)
- React community pour les outils extraordinaires
- Les familles sénégalaises qui testent et donnent des retours

---

<p align="center">
  <strong>Fait avec ❤️ au Sénégal · © 2025 Yëkëni</strong><br/>
  <em>Préservons ensemble l'héritage culturel africain</em>
</p>
