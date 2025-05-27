const generateToken = require("../Config/utils")
const Admin = require("../Models/adminSchema")
const bcrypt = require('bcryptjs')

const adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({ message: "all fields required" })
        }
        const adminExist = await Admin.findOne({ email })
        if (adminExist) {
            return res.status(500).json({ message: 'admin already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({
            email,
            password: hashedPassword
        })
        if (newAdmin) {
            generateToken(newAdmin._id, res)
            await newAdmin.save()
            res.status(200).json({ message: 'admin account created succesfull' })
        }
    }
    catch (error) {
        console.log(error, 'error occured on adminRegister')
        res.status(500).json({ message: error.message })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({ message: 'all fields required' })
        }
        const existingAdmin = await Admin.findOne({ email })
        if (!existingAdmin) {
            return res.status(400).json({ message: 'admin not found' })
        }

        const comparePassword = await bcrypt.compare(password, existingAdmin.password)
        if (!comparePassword) {
            return res.status(500).json({ message: 'password not match' })
        }
        const token = generateToken(existingAdmin._id, res)
        res.status(200).json({ message: 'login succesfull', email: existingAdmin.email, token })

    } catch (error) {
        console.log(error, 'error occured on adminLogin')
        res.status(500).json({ message: error.message })
    }
}
const adminLogout = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })
        res.status(200).json({ message: 'logout succesfull' })
    } catch (error) {
        console.log(error, 'error occured on adminLogout')
        res.status(500).json({ message: error.message })
    }
}
module.exports = { adminRegister, adminLogin, adminLogout }