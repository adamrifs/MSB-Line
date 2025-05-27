const generateToken = require("../Config/utils")
const bcrypt = require('bcryptjs')
const User = require("../Models/userSchema")

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(500).json({ message: 'All fields required' })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(500).json({ message: 'User already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await new User({ name, email, password: hashedPassword })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(200).json({ message: 'Signup Succesfull', newUser })
        }
    } catch (error) {
        console.log(error, 'error occured on userRegister')
        res.status(500).json({ message: error.message })
    }
}
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({ message: 'All fields required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(500).json({ message: 'password not match' })
        }
        const token = generateToken(user._id, res)
        res.status(200).json({ message: 'Login Succesfull', email: user.email, token })
    } catch (error) {
        console.log(error, 'error occured on userLogin')
        res.status(500).json({ message: error.message })
    }
}
module.exports = { userRegister ,userLogin }