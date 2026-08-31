require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { testConnection } = require('./db/connection');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive:true });

const allowedOrigin = process.env.CLIENT_ORIGIN;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : undefined));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(uploadDir));

app.get('/', (_req,res)=>res.json({success:true,name:'Smart Civic Complaint API',version:'1.0.0'}));
app.get('/api/health', async (_req,res)=>{
  try { await testConnection(); res.json({success:true,server:'ok',database:'ok'}); }
  catch(error){ console.error('Health check:',error.message); res.status(503).json({success:false,server:'ok',database:'error',message:'Database connection failed.'}); }
});
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/ai', require('./routes/ai'));

app.use((err,_req,res,_next)=>{
  console.error(err);
  if(err.code==='LIMIT_FILE_SIZE') return res.status(413).json({success:false,message:'Image is too large. Maximum size is 10MB.'});
  if(err.message && err.message.startsWith('Only JPG')) return res.status(400).json({success:false,message:err.message});
  if(err.code==='23503') return res.status(400).json({success:false,message:'Referenced user or department does not exist.'});
  if(err.code==='23505') return res.status(409).json({success:false,message:'A record with the same unique value already exists.'});
  const status = Number(err.statusCode) || 500;
  res.status(status).json({success:false,message: status === 500 ? 'Internal server error.' : err.message});
});
app.use((_req,res)=>res.status(404).json({success:false,message:'API route not found.'}));

app.listen(PORT,()=>console.log(`Smart Civic API running on http://localhost:${PORT}`));
