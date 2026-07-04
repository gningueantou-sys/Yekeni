# Tutoriel : Démarrer et présenter Yëkëni

Ce tutoriel pas-à-pas est conçu pour guider un nouvel utilisateur (ou un animateur de démo) à travers les actions essentielles : créer une famille, ajouter des membres, construire l'arbre, documenter la mémoire familiale et exporter un PDF.

Durée estimée pour l'ensemble : 10–20 minutes (selon la vitesse et le réseau).

---

## Pré-requis rapides
- Avoir cloné le projet et installé les dépendances (voir la section Installation dans le README).
- Variables d'environnement configurées : `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, (optionnel) `REACT_APP_CLAUDE_API_KEY`.
- Compte(s) de démonstration prêts : 1 Admin (chef de famille), 1 Membre simple.

---

## 1) Créer une famille
1. Se connecter avec le compte Admin.
2. Aller sur la page "Créer une famille".
3. Remplir les champs essentiels : nom de la famille, description, pays/région, langue principale.
4. Cliquer sur "Créer".

Temps estimé : 30–60s.

Conseils : utilisez un nom de famille de test (ex : "Diop-Test") et une courte description.

---

## 2) Ajouter des membres
1. Depuis la page famille, cliquer sur "Ajouter un membre".
2. Remplir : nom, prénom, date de naissance, ville/pays, rôle (membre/admin), photo (si possible).
3. Pour données sensibles (santé) : remplir le groupe sanguin, allergies, antécédents.
4. Enregistrer.

Répéter pour 3–5 membres pour une démo réaliste.

Temps estimé : 30–90s par membre.

Sécurité : n'ajoutez pas de vraies informations sensibles lors d'une démo publique.

---

## 3) Construire l'arbre
1. À partir d'un membre, ouvrir la fiche et utiliser le bouton "Lier" ou "Ajouter relation".
2. Choisir le type de relation (père, mère, enfant, conjoint, frère/sœur) et sélectionner le membre cible.
3. Valider la relation. L'arbre se met à jour en temps réel.

Démonstration : effectuez une liaison parent→enfant en direct pour montrer le rafraîchissement de l'arbre.

Temps estimé : 1–2 min.

---

## 4) Mémoire familiale (Timeline)
1. Aller sur la section "Mémoire" ou "Timeline".
2. Cliquer sur "Ajouter un souvenir".
3. Uploader une photo ou un court fichier audio/vidéo, ajouter un titre et une description.
4. Catégoriser (mariage, naissance, anecdote, etc.) et enregistrer.
5. Montrer la lecture d'un enregistrement audio (si disponible).

Temps estimé : 1–2 min.

Accessibilité : ajouter un texte descriptif pour chaque média.

---

## 5) Générer une biographie IA
1. Ouvrir une fiche membre et cliquer sur "Générer biographie".
2. Attendre la réponse (quelques secondes selon quota).
3. Vérifier le texte généré, éditer si nécessaire et sauvegarder.

Notes : vérifier que `REACT_APP_CLAUDE_API_KEY` est présente et que le quota est suffisant.

Temps estimé : 10–30s.

---

## 6) Exporter un PDF & partager
1. Aller sur la page famille ou fiche membre.
2. Cliquer sur "Exporter PDF".
3. Vérifier l'aperçu (5 pages), télécharger et/ou afficher le QR code.
4. Montrer comment partager le lien ou le QR aux membres.

Temps estimé : 30s–1 min.

---

## 7) Gouvernance & Notifications
- Montrer le panneau Admin : gestion des rôles (Admin / Co-Admin / Membre / Invité).
- Expliquer le transfert sécurisé de rôle et les audit logs.
- Montrer une notification de calendrier (ex : rappel 7 jours avant un anniversaire).

---

## Conseils pour l'animateur
- Préparez des comptes et données anonymisées.
- Ayez le site en production (Vercel) comme plan B.
- Testez tout 24h avant la démo.
- Gardez les étapes courtes et visuelles.

---

## Contenu à ajouter dans `docs/` après la démo
- Captures d'écran nommées selon `docs/screenshots/` (voir guide).
- Un enregistrement vidéo (optionnel) de la démo pour la documentation.
- Mises à jour du tutoriel si des changements UI surviennent.
