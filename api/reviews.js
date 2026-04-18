const { randomUUID } = require('crypto');
const { requireRole } = require('../auth');
const storage = require('../lib/storage');

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    // GET all reviews - Admin & Poster
    if (method === 'GET') {
      const authResult = await requireRole(req, ['admin', 'poster']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const reviews = await storage.getAllReviews();
      return res.status(200).json(reviews);
    }

    // POST add review(s) - Admin only
    if (method === 'POST') {
      const authResult = await requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const body = req.body;
      const items = Array.isArray(body) ? body : [body];
      const batchId = randomUUID();
      const now = new Date().toISOString();

      const added = [];
      for (const r of items) {
        const review = {
          id: randomUUID(),
          batch_id: batchId,
          texte: r.texte || '',
          auteur_fictif: r.auteur || r.auteur_fictif || '',
          prestation: r.prestation || '',
          note: r.note || 5,
          longueur: r.longueur || '',
          added_at: now,
          status: r.status || 'pending',
          compte_google: r.compte_google || null,
          posted_at: r.posted_at || null,
          source: r.source || 'generated',
          notes: r.notes || ''
        };
        
        const result = await storage.addReview(review);
        added.push(result);
      }

      return res.status(201).json(added);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reviews API error:', error);
    return res.status(500).json({ error: error.message, stack: error.stack?.split('\n').slice(0, 3).join(' | ') });
  }
}
