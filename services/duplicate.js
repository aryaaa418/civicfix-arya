const { query } = require('../db/connection');

async function findDuplicate(category, latitude, longitude, radiusKm = 0.1) {
  if (!category || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return null;
  const result = await query(`
    SELECT id, public_id, category, latitude, longitude, status, created_at
    FROM complaints
    WHERE category = $1
      AND status <> 'RESOLVED'
      AND latitude BETWEEN $2 - 0.002 AND $2 + 0.002
      AND longitude BETWEEN $3 - 0.002 AND $3 + 0.002
      AND (
        6371 * acos(LEAST(1, GREATEST(-1,
          cos(radians($2)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($3)) +
          sin(radians($2)) * sin(radians(latitude))
        )))
      ) <= $4
    ORDER BY created_at ASC
    LIMIT 1
  `, [category, Number(latitude), Number(longitude), radiusKm]);
  return result.rows[0] || null;
}

module.exports = { findDuplicate };
