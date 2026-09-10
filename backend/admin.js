const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/stats", async (req, res) => {
    try {
        const total = await pool.query("SELECT COUNT(*) FROM complaints");
        const pending = await pool.query(
            "SELECT COUNT(*) FROM complaints WHERE status = 'PENDING'"
        );
        const progress = await pool.query(
            "SELECT COUNT(*) FROM complaints WHERE status = 'IN_PROGRESS'"
        );
        const resolved = await pool.query(
            "SELECT COUNT(*) FROM complaints WHERE status = 'RESOLVED'"
        );
        const duplicates = await pool.query(
            "SELECT COUNT(*) FROM complaints WHERE duplicate_of IS NOT NULL"
        );

        res.json({
            total: Number(total.rows[0].count),
            pending: Number(pending.rows[0].count),
            inProgress: Number(progress.rows[0].count),
            resolved: Number(resolved.rows[0].count),
            duplicates: Number(duplicates.rows[0].count)
        });
    } catch (error) {
        res.status(500).json({ message: "Dashboard error" });
    }
});

router.get("/complaints", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.id, c.title, c.category, c.priority, c.status,
                   c.address, c.latitude, c.longitude, c.created_at,
                   d.name AS department,
                   c.duplicate_of, c.duplicate_count
            FROM complaints c
            LEFT JOIN departments d ON c.department_id = d.id
            ORDER BY c.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch complaints" });
    }
});

router.patch("/complaints/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = [
            "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"
        ];

        if (!allowedStatuses.includes(status))
            return res.status(400).json({ message: "Invalid status" });

        const result = await pool.query(
            `UPDATE complaints
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [status, req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Could not update status" });
    }
});

module.exports = router;
