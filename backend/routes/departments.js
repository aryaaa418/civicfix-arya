const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
router.get('/', async (_req,res,next)=>{ try { const result=await query('SELECT id,name,code,description FROM departments ORDER BY name'); res.json({success:true,departments:result.rows}); } catch(error){next(error);} });
module.exports=router;
