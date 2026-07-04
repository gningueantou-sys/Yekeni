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
  <img src="https://img.shields.io/badge/Langues-FR%20%7C%20WO%20%7C%20FUL-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Made%20in-Sénégal%20🇸🇳-green?style=flat-square" />
</p>

<p align="center">
  🚀 <strong><a href="https://yekeni.vercel.app">Découvrez l'application</a></strong> · 
  📖 <strong><a href="#-démo--tutoriel">Voir la Démo</a></strong> ·
  🐛 <strong><a href="#-faq--troubleshooting">FAQ & Support</a></strong>
</p>

---

## 📹 Démo & Tutoriel

### Plan de la démo (suggestion — 10–15 minutes)
- 0:00 — Introduction rapide (objectif de Yëkëni)
- 0:30 — Connexion : compte démo Admin & Membre
- 1:30 — Vue Arbre Généalogique : navigation, sélection d'un membre, édition rapide (3–4 min)
- 5:30 — Profils & Fiche santé : montrer données sensibles (sécurité/RLS)
- 7:30 — Mémoire familiale : upload photo/voix, timeline
- 9:30 — Carte & Statistiques : localisation et graphiques
- 11:00 — Export PDF & partage (QR / lien)
- 12:30 — Gouvernance : Admin / Co-Admin / audit logs
- 13:30 — Q&R et prochaines étapes

Conseils pour la démo
- Préparez des comptes de démonstration et des données anonymisées.
- Vérifiez variables d'environnement (Supabase, Claude) avant la démo.
- Ayez la version Vercel prête comme plan B si la démo locale échoue.
- Faites un run de test 24h avant pour vérifier les flux (connexion, CRUD, IA, export).

---

### Tutoriel pas-à-pas (pour README / docs/tutorial.md)
Objectif : amener un nouvel utilisateur à créer une famille, ajouter des membres et produire un PDF.

1. Installer & lancer (voir la section Installation déjà présente).
2. Créer une famille : page "Créer une famille" — remplir nom, description, région, langue.
3. Ajouter membres : nom, date de naissance, photo (anonymisée si public), ville/pays, role (membre/admin).
4. Construire l'arbre : lier parents/enfants/conjoints depuis la fiche membre ou depuis l'éditeur d'arbre.
5. Ajouter mémoire : créer un événement (photo + description et/ou enregistrement audio).
6. Générer biographie IA : bouton "Générer biographie" (attendre quelques secondes selon quota API).
7. Exporter PDF : bouton "Exporter" → vérifier contenu et QR code.

Pour chaque étape dans docs/tutorial.md : ajouter
- capture d'écran illustrant la page
- durée estimée (30s–2min selon l'action)
- note sécurité (ex: comment gérer les données de santé)

---

### Galerie de captures d'écran — guide & exemple
- Emplacement recommandé : `docs/screenshots/`
- Nommage conseillé :
  - `01-dashboard.png`
  - `02-tree-overview.png`
  - `03-tree-member-selected.png`
  - `04-profile.png`
  - `05-health.png`
  - `06-timeline.png`
  - `07-map.png`
  - `08-stats.png`
  - `09-export-pdf.png`
  - `10-admin.png`

Résolution / format
- Recommandé : 1280×720 (min) ou 1920×1080 (HD)
- Optimiser pour le web : PNG/JPEG < 300 KB si possible

Exemple Markdown à insérer dans le README (mini-galerie)

```markdown
### Galerie — Aperçus

<p align="center">
  <a href="docs/screenshots/02-tree-overview.png"><img src="docs/screenshots/02-tree-overview.png" alt="Arbre - vue générale" width="280" style="margin:6px;"/></a>
  <a href="docs/screenshots/03-tree-member-selected.png"><img src="docs/screenshots/03-tree-member-selected.png" alt="Arbre - membre sélectionné" width="280" style="margin:6px;"/></a>
  <a href="docs/screenshots/04-profile.png"><img src="docs/screenshots/04-profile.png" alt="Fiche profil" width="280" style="margin:6px;"/></a>
</p>

Voir la galerie complète: `docs/screenshots/`
```

Accessibilité
- Ajoutez toujours un alt text descriptif pour chaque image.

---

### Checklist pré-demo (copier/coller)
- [ ] Compte démo Admin et compte Membre créés
- [ ] Images test dans `docs/screenshots/` (noms recommandés ci‑dessus)
- [ ] Variables d'env (Supabase URL/ANON, CLAUDE_API_KEY) valides et testées
- [ ] Export PDF testé et téléchargeable
- [ ] Tests IA (biographie) passés — vérifier quotas
- [ ] Connexion à Vercel prête en plan B

---

<!-- Le reste du README (architecture, installation, code exemples, FAQ, etc.) reste inchangé -->

## 🎬 Vue d'Ensemble (Arbre Généalogique)
```
┌─────────────────────────────────────────┐
│   🌳 Arbre Généalogique Interactif      │
│                                         │
│   Grands-parents (1900-1950)           │
│         ↓                              │
│   Parents (1950-1980)                  │
│         ↓                              │
│   Enfants (1980-2010) ← VOUS ÊTES ICI  │
└─────────────────────────────────────────┘
✨ Cliquez sur un membre pour voir son profil complet
🔗 Naviguez entre les relations (père, mère, frères, sœurs, enfants)
```

### 🖼️ Galerie de Captures d'Écran (résumé)

> **📌 Note** : Remplacez les chemins ci-dessous par vos vraies screenshots
> - `docs/screenshots/` — Créez ce dossier et ajoutez vos images

| Fonctionnalité | Description |
|---|---|
| 🌳 **Arbre Généalogique** | Navigation fluide, zoom/pan, relations multiples |
| 👥 **Profils Membres** | Info personnelle, santé, racines, photos |
| 📸 **Mémoire Familiale** | Timeline interactive, souvenirs catégorisés |
| 🗺️ **Carte Mondiale** | Localisation temps réel de tous les membres |
| 📊 **Statistiques** | Graphiques ethnicité, âge, distribution géographique |
| 📄 **Export PDF** | Rapport complet avec QR code |

---

(rest of README unchanged)
