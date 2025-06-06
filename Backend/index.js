const express = require('express')
const app = express()
require('dotenv').config()
const dbConnect = require('./Database/config')
const { seedSuperAdmin } = require('./Seeding/superAdminSeed')
const userRoutes = require('./Routes/userRoutes')
const cookieParser = require('cookie-parser')
const cloudinaryConfig = require('./Cloudinary/Config')
//connect to the database
dbConnect()
//seed the super admin user
seedSuperAdmin()
//configure cloudinary
cloudinaryConfig()


app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({ message: 'Its working' })
})

app.use('/api',userRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})