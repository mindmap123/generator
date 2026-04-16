const { kv } = require('@vercel/kv');
const { requireRole } = require('../../auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin only
  const authResult = requireRole(req, ['admin']);
  if (!authResult.authorized) {
    return res.status(403).json({ error: authResult.error });
  }

  try {
    const reviews = await kv.get('reviews') || [];
    const lastBatchId = await kv.get('last_import_batch');

    if (!lastBatchId) {
      return res.status(200).json({ removed: 0 });
    }

    const before = reviews.length;
    const filtered = reviews.filter(r => r.batch_id !== lastBatchId);
    
    await kv.set('reviews', filtered);
    await kv.del('last_import_batch');

    return res.status(200).json({ removed: before - filtered.length });
  } catch (error) {
    console.error('Undo import error:', error);
    return res.status(500).json({ error: error.message });
  }
}
