const express = require('express')
const app = express()
require('dotenv').config()
const dbConnect = require('./Database/config')
dbConnect()


app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Its working' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})