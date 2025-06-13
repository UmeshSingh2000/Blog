const express = require('express')
const app = express()
require('dotenv').config()
const dbConnect = require('./Database/config')
const { seedSuperAdmin } = require('./Seeding/superAdminSeed')
const userRoutes = require('./Routes/userRoutes')
const cookieParser = require('cookie-parser')
const cloudinaryConfig = require('./Cloudinary/Config')
const cors = require('cors')
const authenticateToken = require('./Middlewares/authenticateToken')
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
    'https://potatotrails.vercel.app'
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

app.get('/', (req, res) => {
    res.json({ message: 'Its working' })
})

app.get('/api/auth/check', authenticateToken, (req, res) => {

    res.status(200).json({
        message: 'You are authenticated',
        user: req.user
    })
})

app.use('/api', userRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})