const express = require('express')
const cors = require('cors')
const connectDB = require('./Config/db.js')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectCloudinary = require('./Config/cloudinary.js')
const productRoutes = require('./Routes/productRoutes.js')
const adminRoutes = require('./Routes/adminRoutes.js')
const cartRoutes = require('./Routes/cartRoutes.js')
const userRoutes = require('./Routes/userRoutes.js')
dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5175', 'http://localhost:5176', 'https://msbline.vercel.app', 'https://msbline-admin-pannel.vercel.app'],
    credentials: true
}))
app.use(cookieParser())

connectDB()
connectCloudinary()

app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cart', cartRoutes)
app.listen(port, () => {
    console.log(`server running succesfull on ${port}`)
})
