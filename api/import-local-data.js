const { requireRole } = require('../auth');
const storage = require('../lib/storage');

// Données locales à importer (copiez-collez depuis data.json)
const LOCAL_DATA = {
  "reviews": [],
  "last_import_batch": null
};

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
    const { reviews, last_import_batch } = req.body || LOCAL_DATA;
    
    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Importer les reviews
    await storage.set('reviews', reviews);
    
    // Importer le dernier batch si présent
    if (last_import_batch) {
      await storage.set('last_import_batch', last_import_batch);
    }

    return res.status(200).json({ 
      success: true, 
      imported: reviews.length,
      message: `${reviews.length} reviews importées avec succès`
    });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ error: error.message });
  }
}
