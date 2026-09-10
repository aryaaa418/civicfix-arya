const pool = require("../db");

async function findDuplicate(category, latitude, longitude) {
    const query = `
        SELECT id, latitude, longitude
        FROM complaints
        WHERE category = $1
        AND status != 'RESOLVED'
        AND (
            6371 * acos(
                cos(radians($2))
                * cos(radians(latitude))
                * cos(radians(longitude) - radians($3))
                + sin(radians($2))
                * sin(radians(latitude))
            )
        ) <= 0.1
        ORDER BY created_at ASC
        LIMIT 1;
    `;

    const result = await pool.query(query, [category, latitude, longitude]);
    return result.rows[0] || null;
}

module.exports = { findDuplicate };
