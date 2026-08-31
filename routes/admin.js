const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');

router.get('/stats', async (_req,res,next)=>{
  try {
    const result = await query(`SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status='PENDING')::int AS pending,
      COUNT(*) FILTER (WHERE status='IN_PROGRESS')::int AS in_progress,
      COUNT(*) FILTER (WHERE status='RESOLVED')::int AS resolved,
      COUNT(*) FILTER (WHERE status='REJECTED')::int AS rejected,
      COUNT(*) FILTER (WHERE duplicate_of IS NOT NULL)::int AS duplicates
      FROM complaints`);
    res.json({success:true,stats:result.rows[0]});
  } catch(error){next(error);}
});

router.get('/complaints', async (_req,res,next)=>{
  try {
    const result = await query(`SELECT c.*, d.name AS department_name, d.code AS department_code FROM complaints c LEFT JOIN departments d ON d.id=c.department_id ORDER BY c.created_at DESC`);
    res.json({success:true,complaints:result.rows});
  } catch(error){next(error);}
});

router.patch('/complaints/:id/status', async (req,res,next)=>{
  try {
    if (!/^\d+$/.test(String(req.params.id))) return res.status(400).json({success:false,message:'Complaint ID must be numeric.'});
    const status=String(req.body.status||'').trim().toUpperCase();
    if(!['PENDING','IN_PROGRESS','RESOLVED','REJECTED'].includes(status)) return res.status(400).json({success:false,message:'Invalid status.'});
    const result=await query('UPDATE complaints SET status=$1,updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',[status,Number(req.params.id)]);
    if(!result.rows[0]) return res.status(404).json({success:false,message:'Complaint not found.'});
    res.json({success:true,complaint:result.rows[0]});
  }catch(error){next(error);}
});
module.exports=router;
