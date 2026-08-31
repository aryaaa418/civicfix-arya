function validNumber(value) { return value !== '' && Number.isFinite(Number(value)); }
function validateCoordinates(req, res, next) {
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);
  if (!validNumber(req.body.latitude) || !validNumber(req.body.longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({ success: false, message: 'Valid latitude and longitude are required.' });
  }
  req.body.latitude = latitude;
  req.body.longitude = longitude;
  next();
}
function validateId(req, res, next) {
  if (!/^\d+$/.test(String(req.params.id))) return res.status(400).json({ success:false, message:'Complaint ID must be numeric.' });
  next();
}
module.exports = { validateCoordinates, validateId };
