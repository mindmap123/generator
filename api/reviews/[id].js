const { requireRole } = require('../../auth');
const storage = require('../../lib/storage');

module.exports = async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    // PUT update review - Admin & Poster
    if (method === 'PUT') {
      const authResult = await requireRole(req, ['admin', 'poster']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const body = req.body;
      const review = await storage.getReviewById(id);
      
      if (!review) {
        return res.status(404).json({ error: 'Not found' });
      }

      const updated = await storage.updateReview(id, body);
      return res.status(200).json(updated);
    }

    // DELETE single review - Admin only
    if (method === 'DELETE') {
      const authResult = await requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      await storage.deleteReview(id);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Review update error:', error);
    return res.status(500).json({ error: error.message });
  }
}
