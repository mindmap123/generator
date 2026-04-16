// Neon PostgreSQL storage
const { neon } = require('@neondatabase/serverless');

// Connexion à Neon
function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// Récupérer toutes les reviews
async function getAllReviews() {
  const sql = getDb();
  const reviews = await sql`SELECT * FROM reviews ORDER BY added_at DESC`;
  return reviews;
}

// Ajouter une review
async function addReview(review) {
  const sql = getDb();
  const result = await sql`
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
  return result[0];
}

// Mettre à jour une review
async function updateReview(id, updates) {
  const sql = getDb();
  
  // Récupérer la review actuelle
  const current = await getReviewById(id);
  if (!current) {
    throw new Error('Review not found');
  }
  
  // Fusionner les updates
  const updated = { ...current, ...updates };
  
  // Mettre à jour avec toutes les valeurs
  const result = await sql`
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
  
  return result[0];
}

// Supprimer une review
async function deleteReview(id) {
  const sql = getDb();
  await sql`DELETE FROM reviews WHERE id = ${id}`;
  return true;
}

// Récupérer une review par ID
async function getReviewById(id) {
  const sql = getDb();
  const result = await sql`SELECT * FROM reviews WHERE id = ${id}`;
  return result[0];
}

module.exports = {
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
  getReviewById
};
