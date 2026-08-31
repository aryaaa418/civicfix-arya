const fs = require('fs');

function normalizeAIResult(result = {}) {
  const category = String(result.category || result.label || result.prediction || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
  const raw = Number(result.confidence ?? result.score);
  const confidence = Number.isFinite(raw) ? (raw <= 1 ? Math.round(raw * 100) : Math.round(raw)) : 0;
  const priority = String(result.priority || result.severity || 'MEDIUM').trim().toUpperCase();
  return {
    category: category || 'UNKNOWN',
    confidence: Math.max(0, Math.min(100, confidence)),
    priority: ['LOW','MEDIUM','HIGH','CRITICAL'].includes(priority) ? priority : 'MEDIUM',
    description: String(result.description || result.message || '')
  };
}

async function predictFromImage(filePath, mimeType) {
  const aiUrl = process.env.AI_API_URL;
  if (!aiUrl) {
    const error = new Error('AI service is not configured yet.');
    error.statusCode = 503;
    throw error;
  }
  const body = fs.readFileSync(filePath);
  const response = await fetch(aiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': mimeType || 'application/octet-stream',
      ...(process.env.AI_API_KEY ? { Authorization: `Bearer ${process.env.AI_API_KEY}` } : {})
    },
    body
  });
  if (!response.ok) {
    const error = new Error(`AI service returned HTTP ${response.status}.`);
    error.statusCode = 502;
    throw error;
  }
  return normalizeAIResult(await response.json());
}

module.exports = { predictFromImage, normalizeAIResult };
