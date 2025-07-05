const express = require('express')
const app = express()
require('dotenv').config()
const dbConnect = require('./Database/config')
const { seedSuperAdmin } = require('./Seeding/superAdminSeed')
const userRoutes = require('./Routes/userRoutes')
const superAdminRoutes = require('./Routes/superAdminRoutes')
const cookieParser = require('cookie-parser')
const cloudinaryConfig = require('./Cloudinary/Config')
const cors = require('cors')
const authenticateToken = require('./Middlewares/authenticateToken')
const fetchWeather = require('./Helpers/fetchWeather')




//connect to the database
dbConnect()
//seed the super admin user
seedSuperAdmin()
//configure cloudinary
cloudinaryConfig()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://potatotrailsdashboard.vercel.app',
    'https://potatotrails.vercel.app',
    'https://www.potatotrail.life'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get('/', async (req, res) => {
    try {
        await fetch('https://keepalive-jmgo.onrender.com');
        // await fetch('https://keepalive-5ujp.onrender.com');
        res.json({ message: 'Its working' })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.get('/api/auth/check', authenticateToken, (req, res) => {

    res.status(200).json({
        message: 'You are authenticated',
        user: req.user,
    })
})
app.get('/api/feature/weather',async(req,res)=>{
    try {
        const weatherData = await fetchWeather();
        if (!weatherData) {
            return res.status(500).json({ message: 'Failed to fetch weather data' });
        }
        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.use('/api', userRoutes)
app.use('/api/superAdmin', superAdminRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
