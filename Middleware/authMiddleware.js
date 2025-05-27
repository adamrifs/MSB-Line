const dotenv = require('dotenv')
const User = require('../Models/userSchema')
const jwt = require('jsonwebtoken')
dotenv.config()

const authProtectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(500).json({ message: 'Token required' })
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodeToken) {
            return res.status(500).json({ message: 'Unauthorized Login' })
        }
        const user = await User.findById(decodeToken._id).select('-password')
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error, 'error occured on authProtectRoute')
    }
}

module.exports = authProtectRoute