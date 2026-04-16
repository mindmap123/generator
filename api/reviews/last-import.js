const { requireRole } = require('../../auth');
const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await requireRole(req, ['admin']);
  if (!authResult.authorized) {
    return res.status(403).json({ error: authResult.error });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Trouver le dernier batch_id importé
    const lastBatch = await sql`
      SELECT batch_id FROM reviews
      ORDER BY added_at DESC
      LIMIT 1
    `;

    if (lastBatch.length === 0) {
      return res.status(200).json({ removed: 0 });
    }

    const batchId = lastBatch[0].batch_id;

    const result = await sql`
      DELETE FROM reviews WHERE batch_id = ${batchId}
    `;

    return res.status(200).json({ removed: result.count ?? 0 });
  } catch (error) {
    console.error('Undo import error:', error);
    return res.status(500).json({ error: error.message });
  }
};
