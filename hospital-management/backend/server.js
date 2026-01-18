const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/appointment', require('./routes/appointment'))
app.use('/api/doctor', require('./routes/doctor'))
app.use('/api/patient', require('./routes/patient'))


app.get('/', (req,res) =>{
    res.json({message: 'Hospital Management API is running...'})
})

app.get('/api/dashboard', async(req, res)=>{
    try{
        const Patient = require('./models/Patient')
        const Doctor = require('./models/Doctor')
        const Appointment = require('./models/Appointment')

        totalPatient = await Patient.countDocuments()
        totalDoctor = await Doctor.countDocuments()
        totalAppointment  = await Appointment.countDocuments()
        totalPending = await Appointment.countDocuments({status: 'pending'})

        res.json({
            totalPatient,
            totalDoctor,
            totalAppointment,
            totalPending
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT,() =>{
console.log(`Server is running on port ${PORT} `);})