const { randomUUID } = require('crypto');
const { requireRole } = require('../../auth');
const storage = require('../../lib/storage');

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    // GET all reviews - Admin & Poster
    if (method === 'GET') {
      const authResult = requireRole(req, ['admin', 'poster']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const reviews = await storage.get('reviews') || [];
      return res.status(200).json(reviews);
    }

    // POST add review(s) - Admin only
    if (method === 'POST') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const body = req.body;
      const reviews = await storage.get('reviews') || [];
      const items = Array.isArray(body) ? body : [body];
      const batchId = randomUUID();
      const now = new Date().toISOString();

      const added = items.map(r => ({
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
        disappeared_at: r.disappeared_at || null,
        last_checked_at: r.last_checked_at || null,
        source: r.source || 'generated',
        notes: r.notes || ''
      }));

      reviews.push(...added);
      await storage.set('reviews', reviews);
      await storage.set('last_import_batch', batchId);

      return res.status(201).json(added);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reviews API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
