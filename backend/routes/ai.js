const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { predictFromImage } = require('../services/ai');
router.post('/predict', upload.single('photo'), async (req,res,next)=>{
  try {
    if(!req.file) return res.status(400).json({success:false,message:'photo is required.'});
    const result=await predictFromImage(req.file.path,req.file.mimetype);
    res.json({success:true,ai:result});
  }catch(error){next(error);}
});
module.exports=router;
