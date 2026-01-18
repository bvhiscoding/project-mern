const express =require('express')
const router = express.Router()
const Doctor = require('../models/Doctor')
const protect= require('../middleware/auth')


router.get('/', protect, async(req ,res)=>{
    try{
        const { search, specialty, available } = req.query
        let query = {}
        if(search){
query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specialty: { $regex: search, $options: 'i' } }
            ]
        }
        if(specialty){
            query.specialty = specialty
        }

if (available !== undefined) {
            query.available = available === 'true'
        }
        const doctors = await Doctor.find(query).sort({createdAt: -1})
        res.json(doctors)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/:id',protect, async(req,res)=>{
    try{
        const doctor = await Doctor.findById(req.params.id)
        if(!doctor){
            return res.status(404).json({message: 'Doctor not found'})
        }
        res.json(doctor)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/',protect, async (req,res) =>{
    try{
        const doctor = await Doctor.create(req.body)
        res.status(201).json(doctor)
    }catch(error){
        res.status(400).json({message:error.message})
    }
})

router.put('/:id',protect, async (req,res) =>{
    try{
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body , {new:true , runValidators:true})
        if(!doctor){
            return res.status(404).json({message:  'Doctor not found'})
        }
        res.json(doctor)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete('/:id',protect, async (req,res) =>{
    try{
        const doctor = await Doctor.findByIdAndDelete(req.params.id)
        if(!doctor){
            return res.status(404).json({message:'Doctor not found'})
        }
        res.json({message: 'Doctor removed'})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


module.exports = router