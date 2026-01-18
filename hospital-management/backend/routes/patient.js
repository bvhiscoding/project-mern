const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const protect = require('../middleware/auth');



router.get('/',protect, async(req,res)=>{
    try{
        const {search, gender, bloodGroup} = req.query;
        let query = {};
        if(search){
            query.name = { $regex: search, $options: 'i' }
        }
        if(gender){
            query.gender = gender
        }
        if(bloodGroup){
            query.bloodGroup =bloodGroup
        }
        const patients = await Patient.find(query).sort({createdAt:-1})
        res.json(patients)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', protect, async (req,res ) =>{
    try{
        const patient = await Patient.findById(req.params.id)
        if(!patient){
            return res.status(404).json({message: 'Patient not found'})
        }
        res.json(patient)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/',protect, async(req,res)=>{
    try{
        const patient = await Patient.create(req.body);
        res.status(201).json(patient)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})
router.put('/:id', protect, async (req,res)=>{
    try{
        const patient = await Patient.findByIdAndUpdate(req.params.id , req.body , {new: true, runValidators: true})
        if(!patient){
            return res.status(404).json({message: 'Patient not found'})
        }
        res.json(patient)
    }catch(error){
        res.status(500).json({message:error.message})
    }    
})

router.delete('/:id', protect,async (req,res)=>{
    try{
        const patient = await Patient.findByIdAndDelete(req.params.id)
        if(!patient){
            return res.status(404).json({message:  'Patient not found'})
        }
        res.json({message: 'Patient removed'})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})
module.exports = router