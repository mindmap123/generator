const { requireRole } = require('../../auth');
const storage = require('../../lib/storage');

module.exports = async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    const reviews = await storage.get('reviews') || [];

    // PUT update review - Admin & Poster
    if (method === 'PUT') {
      const authResult = requireRole(req, ['admin', 'poster']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const body = req.body;
      const idx = reviews.findIndex(r => r.id === id);
      
      if (idx === -1) {
        return res.status(404).json({ error: 'Not found' });
      }

      reviews[idx] = { ...reviews[idx], ...body };
      await storage.set('reviews', reviews);

      return res.status(200).json(reviews[idx]);
    }

    // DELETE single review - Admin only
    if (method === 'DELETE') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return res.status(403).json({ error: authResult.error });
      }
      
      const filtered = reviews.filter(r => r.id !== id);
      await storage.set('reviews', filtered);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Review update error:', error);
    return res.status(500).json({ error: error.message });
  }
}
