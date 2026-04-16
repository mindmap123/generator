const { requireRole } = require('../auth');
const storage = require('../lib/storage');
const { randomUUID } = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await requireRole(req, ['admin']);
  if (!authResult.authorized) {
    return res.status(403).json({ error: authResult.error });
  }

  try {
    const { reviews } = req.body || {};

    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Format invalide : { reviews: [...] } attendu' });
    }

    let imported = 0;
    for (const r of reviews) {
      try {
        await storage.addReview({
          id: r.id || randomUUID(),
          batch_id: r.batch_id || randomUUID(),
          texte: r.texte || '',
          auteur_fictif: r.auteur || r.auteur_fictif || '',
          prestation: r.prestation || '',
          note: r.note || 5,
          longueur: r.longueur || '',
          added_at: r.added_at || new Date().toISOString(),
          status: r.status || 'pending',
          compte_google: r.compte_google || null,
          posted_at: r.posted_at || null,
          disappeared_at: r.disappeared_at || null,
          last_checked_at: r.last_checked_at || null,
          source: r.source || 'imported',
          notes: r.notes || ''
        });
        imported++;
      } catch (e) {
        // Ignorer les doublons (même id déjà en base)
        if (!e.message?.includes('duplicate') && !e.message?.includes('unique')) {
          console.error('Error importing review:', e.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      imported,
      message: `${imported} avis importés avec succès`
    });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ error: error.message });
  }
};
