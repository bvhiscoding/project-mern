const express = require('express')
const router = express.Router()
const Stock = require('../models/stock')


router.get('/', async (req,res) =>{
    try{
        const stocks = await Stock.find()
        res.json(stocks)

    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/search', async (req,res)=>{
    try{
        const {q} = req.query
        if(!q) {
            const stocks = await Stock.find()
            return res.json(stocks)
        }
        const stocks = await Stock.find({
            $or:[
                {company:{$regex: q, $options: 'i'}},
                {symbol:{$regex:q,$options:'i'}}
            ]
        })
        res.json(stocks)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req,res)=>{
    try{
        const stock = await Stock.findById(req.params.id)
        if(!stock){
            return res.status(404).json({message: 'Stock not found'})
        }
        res.json(stock)

    }catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router