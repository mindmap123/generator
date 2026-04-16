const { requireRole } = require('../auth');
const storage = require('../lib/storage');

// Toutes vos reviews
const INITIAL_REVIEWS = require('../data.json').reviews;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin only
  const authResult = requireRole(req, ['admin']);
  if (!authResult.authorized) {
    return res.status(403).json({ error: authResult.error });
  }

  try {
    // Charger les reviews existantes
    const existing = await storage.get('reviews') || [];
    
    console.log(`Existing reviews: ${existing.length}`);
    console.log(`Initial reviews: ${INITIAL_REVIEWS.length}`);
    
    // Si déjà des reviews, ne rien faire
    if (existing.length > 0) {
      return res.status(200).json({ 
        message: `${existing.length} reviews déjà présentes`,
        count: existing.length
      });
    }
    
    // Sinon, charger les données initiales
    await storage.set('reviews', INITIAL_REVIEWS);
    await storage.set('last_import_batch', '3c2f5314-26fe-45e6-8e99-5f07fe1cc72b');
    
    return res.status(200).json({ 
      message: `${INITIAL_REVIEWS.length} reviews initialisées avec succès`,
      count: INITIAL_REVIEWS.length
    });
  } catch (error) {
    console.error('Init error:', error);
    return res.status(500).json({ error: error.message });
  }
};
