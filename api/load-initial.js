const { requireRole } = require('../auth');
const storage = require('../lib/storage');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = requireRole(req, ['admin']);
  if (!authResult.authorized) {
    return res.status(403).json({ error: authResult.error });
  }

  try {
    // Vérifier si déjà des données
    const existing = await storage.get('reviews') || [];
    if (existing.length > 0) {
      return res.status(200).json({ 
        message: `${existing.length} reviews déjà chargées`,
        count: existing.length 
      });
    }

    // Charger depuis le body de la requête
    const { reviews } = req.body;
    
    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    await storage.set('reviews', reviews);
    await storage.set('last_import_batch', '3c2f5314-26fe-45e6-8e99-5f07fe1cc72b');

    return res.status(200).json({ 
      message: `${reviews.length} reviews chargées avec succès`,
      count: reviews.length
    });
  } catch (error) {
    console.error('Load error:', error);
    return res.status(500).json({ error: error.message });
  }
};
