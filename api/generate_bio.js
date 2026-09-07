export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prenom, nom, annee, decede, genre } = req.body || {};

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Clé API Anthropic manquante côté serveur (variable d'environnement ANTHROPIC_API_KEY non configurée sur Vercel)." });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Tu es un assistant de généalogie africaine. Génère une belle biographie courte (3-4 phrases) et émouvante pour ce membre de famille:
          - Prénom: ${prenom || ''}
          - Nom: ${nom || ''}
          - Année de naissance: ${annee || 'inconnue'}
          - Statut: ${decede ? 'Décédé(e)' : 'Vivant(e)'}
          - Genre: ${genre === 'homme' ? 'Homme' : (genre === 'femme' ? 'Femme' : 'Non précisé')}
          Écris en français, avec chaleur et respect pour la culture africaine.`
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Erreur API Anthropic' });
    }

    const texte = (data.content || []).map(bloc => bloc.text || '').join('');
    return res.status(200).json({ bio: texte || 'Impossible de générer la biographie.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}