const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getDepartment } = require("../services/routing");
const { findDuplicate } = require("../services/duplicate");

router.post("/", async (req, res) => {
    try {
        const {
            user_id, title, description, category, priority,
            image_url, latitude, longitude, address
        } = req.body;

        const departmentCode = getDepartment(category);
        let departmentId = null;

        if (departmentCode) {
            const departmentResult = await pool.query(
                "SELECT id FROM departments WHERE code = $1",
                [departmentCode]
            );
            if (departmentResult.rows.length > 0)
                departmentId = departmentResult.rows[0].id;
        }

        const duplicate = await findDuplicate(category, latitude, longitude);

        const result = await pool.query(
            `INSERT INTO complaints
            (user_id, title, description, category, priority, image_url,
             latitude, longitude, address, department_id, duplicate_of)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [
                user_id, title, description, category, priority || "MEDIUM",
                image_url, latitude, longitude, address, departmentId,
                duplicate ? duplicate.id : null
            ]
        );

        if (duplicate) {
            await pool.query(
                `UPDATE complaints
                 SET duplicate_count = duplicate_count + 1
                 WHERE id = $1`,
                [duplicate.id]
            );
        }

        res.status(201).json({
            success: true,
            complaint: result.rows[0],
            duplicate: duplicate
                ? { detected: true, originalComplaint: duplicate.id }
                : { detected: false }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create complaint"
        });
    }
});

module.exports = router;
