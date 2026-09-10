require("dotenv").config();
const express = require("express");
const cors = require("cors");

const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Smart Civic Complaint API running" });
});

app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
