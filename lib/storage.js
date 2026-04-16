// Neon PostgreSQL storage via @vercel/postgres
const { sql } = require('@vercel/postgres');

// Récupérer toutes les reviews
async function getAllReviews() {
  const { rows } = await sql`SELECT * FROM reviews ORDER BY added_at DESC`;
  return rows;
}

// Ajouter une review
async function addReview(review) {
  const { rows } = await sql`
    INSERT INTO reviews (
      id, batch_id, texte, auteur_fictif, prestation, note, longueur,
      added_at, status, compte_google, posted_at, disappeared_at, last_checked_at, source, notes
    ) VALUES (
      ${review.id}, ${review.batch_id}, ${review.texte}, ${review.auteur_fictif},
      ${review.prestation}, ${review.note}, ${review.longueur}, ${review.added_at},
      ${review.status}, ${review.compte_google}, ${review.posted_at},
      ${review.disappeared_at ?? null}, ${review.last_checked_at ?? null},
      ${review.source}, ${review.notes}
    )
    RETURNING *
  `;
  return rows[0];
}

// Mettre à jour une review
async function updateReview(id, updates) {
  const current = await getReviewById(id);
  if (!current) throw new Error('Review not found');

  const updated = { ...current, ...updates };

  const { rows } = await sql`
    UPDATE reviews SET
      texte = ${updated.texte},
      auteur_fictif = ${updated.auteur_fictif},
      prestation = ${updated.prestation},
      note = ${updated.note},
      longueur = ${updated.longueur},
      status = ${updated.status},
      compte_google = ${updated.compte_google},
      posted_at = ${updated.posted_at},
      disappeared_at = ${updated.disappeared_at ?? null},
      last_checked_at = ${updated.last_checked_at ?? null},
      source = ${updated.source},
      notes = ${updated.notes}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

// Supprimer une review
async function deleteReview(id) {
  await sql`DELETE FROM reviews WHERE id = ${id}`;
  return true;
}

// Récupérer une review par ID
async function getReviewById(id) {
  const { rows } = await sql`SELECT * FROM reviews WHERE id = ${id}`;
  return rows[0];
}

module.exports = {
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
  getReviewById
};
