const express = require('express');
const path = require('path');
const router = express.Router();
const { query } = require('../db/connection');
const { getDepartmentCode, normalizeCategory, normalizePriority } = require('../services/routing');
const { findDuplicate } = require('../services/duplicate');
const upload = require('../middleware/upload');
const { validateCoordinates, validateId } = require('../middleware/validate');

const clean = (v) => (v === undefined || v === null ? '' : String(v).trim());

router.post('/', upload.single('photo'), validateCoordinates, async (req, res, next) => {
  try {
    const title = clean(req.body.title);
    const description = clean(req.body.description);
    const category = normalizeCategory(req.body.category);
    const priority = normalizePriority(req.body.priority);
    const userId = req.body.user_id ? Number(req.body.user_id) : null;
    const address = clean(req.body.address) || null;

    if (userId !== null && (!Number.isInteger(userId) || userId < 1)) return res.status(400).json({ success:false, message:'user_id must be a positive integer.' });
    if (!category) return res.status(400).json({ success:false, message:'category is required until the AI service is connected.' });

    const departmentCode = getDepartmentCode(category);
    const departmentResult = departmentCode
      ? await query('SELECT id,name,code,description FROM departments WHERE code=$1 LIMIT 1', [departmentCode])
      : { rows: [] };
    const department = departmentResult.rows[0] || null;
    const duplicate = await findDuplicate(category, req.body.latitude, req.body.longitude);
    const imageUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : (clean(req.body.image_url) || null);

    const result = await query(`
      INSERT INTO complaints
        (user_id,title,description,category,priority,image_url,latitude,longitude,address,department_id,duplicate_of)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [userId, title || `Civic issue: ${category}`, description, category, priority, imageUrl,
        req.body.latitude, req.body.longitude, address, department?.id || null, duplicate?.id || null]);

    if (duplicate) await query('UPDATE complaints SET duplicate_count = duplicate_count + 1, updated_at=CURRENT_TIMESTAMP WHERE id=$1', [duplicate.id]);

    const complaint = result.rows[0];
    res.status(201).json({
      success: true,
      complaint,
      department,
      duplicate: duplicate ? { detected:true, originalComplaintId:duplicate.id, originalPublicId:duplicate.public_id } : { detected:false }
    });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const params = [];
    const conditions = [];
    if (req.query.status) { params.push(clean(req.query.status).toUpperCase()); conditions.push(`c.status=$${params.length}`); }
    if (req.query.category) { params.push(normalizeCategory(req.query.category)); conditions.push(`c.category=$${params.length}`); }
    if (req.query.user_id) { const id = Number(req.query.user_id); if (!Number.isInteger(id)) return res.status(400).json({success:false,message:'Invalid user_id.'}); params.push(id); conditions.push(`c.user_id=$${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await query(`
      SELECT c.*, d.name AS department_name, d.code AS department_code
      FROM complaints c LEFT JOIN departments d ON d.id=c.department_id
      ${where} ORDER BY c.created_at DESC
    `, params);
    res.json({success:true, complaints:result.rows});
  } catch (error) { next(error); }
});

async function getComplaint(req, res, next) {
  try {
    const result = await query(`
      SELECT c.*, d.name AS department_name, d.code AS department_code
      FROM complaints c LEFT JOIN departments d ON d.id=c.department_id
      WHERE c.id=$1
    `, [Number(req.params.id)]);
    if (!result.rows[0]) return res.status(404).json({success:false,message:'Complaint not found.'});
    res.json({success:true, complaint:result.rows[0]});
  } catch (error) { next(error); }
}

router.get('/:id', validateId, getComplaint);
router.get('/public/:publicId', async (req,res,next) => {
  try {
    const publicId = clean(req.params.publicId).toUpperCase();
    const result = await query(`SELECT c.*, d.name AS department_name, d.code AS department_code FROM complaints c LEFT JOIN departments d ON d.id=c.department_id WHERE c.public_id=$1`, [publicId]);
    if (!result.rows[0]) return res.status(404).json({success:false,message:'Complaint not found.'});
    res.json({success:true, complaint:result.rows[0]});
  } catch(error){next(error);}
});

router.patch('/:id/status', validateId, async (req,res,next) => {
  try {
    const status = clean(req.body.status).toUpperCase();
    const allowed = ['PENDING','IN_PROGRESS','RESOLVED','REJECTED'];
    if (!allowed.includes(status)) return res.status(400).json({success:false,message:`Status must be one of: ${allowed.join(', ')}`});
    const result = await query('UPDATE complaints SET status=$1,updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',[status,Number(req.params.id)]);
    if (!result.rows[0]) return res.status(404).json({success:false,message:'Complaint not found.'});
    res.json({success:true,complaint:result.rows[0]});
  } catch(error){next(error);}
});

module.exports = router;
