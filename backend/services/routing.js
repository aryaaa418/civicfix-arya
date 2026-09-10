const CATEGORY_TO_DEPARTMENT = {
  POTHOLE: 'ROAD',
  POTHOLES: 'ROAD',
  DAMAGED_ROAD: 'ROAD',
  DAMAGED_ROADS: 'ROAD',
  GARBAGE: 'SANITATION',
  WASTE: 'SANITATION',
  STREETLIGHT: 'ELECTRICITY',
  STREET_LIGHT: 'ELECTRICITY',
  BROKEN_STREETLIGHT: 'ELECTRICITY',
  WATER_LEAKAGE: 'WATER',
  WATER_LEAK: 'WATER',
  DRAINAGE: 'DRAINAGE',
  BLOCKED_DRAIN: 'DRAINAGE'
};

function normalizeCategory(value) {
  return String(value || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
}
function normalizePriority(value) {
  const p = String(value || '').trim().toUpperCase();
  return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(p) ? p : 'MEDIUM';
}
function getDepartmentCode(category) { return CATEGORY_TO_DEPARTMENT[normalizeCategory(category)] || null; }

module.exports = { normalizeCategory, normalizePriority, getDepartmentCode };
