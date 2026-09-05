const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
});

// Get all complaints
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM complaints ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET COMPLAINTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
});

// Create a complaint
router.post("/", async (req, res) => {
  try {
    const { category, description, latitude, longitude, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO complaints
      (category, description, latitude, longitude, priority)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [category, description, latitude, longitude, priority]
    );

    res.status(201).json({
      message: "Complaint created successfully",
      complaint: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE COMPLAINT ERROR:", error);

    res.status(500).json({
      message: "Failed to create complaint",
      error: error.message,
    });
  }
});

module.exports = router;