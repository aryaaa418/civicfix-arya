const departmentRouting = {
    POTHOLE: "ROAD",
    DAMAGED_ROAD: "ROAD",
    GARBAGE: "SANITATION",
    STREETLIGHT: "ELECTRICITY",
    WATER_LEAKAGE: "WATER",
    DRAINAGE: "DRAINAGE"
};

function getDepartment(category) {
    return departmentRouting[category] || null;
}

module.exports = { getDepartment };
