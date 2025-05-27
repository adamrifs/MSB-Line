const express = require('express')
const { adminRegister, adminLogin, adminLogout } = require('../Controllers/adminController')
const protectRoute = require('../Middleware/adminMiddleware')
const router = express.Router()

router.post('/adminRegister', adminRegister)
router.post('/adminLogin', adminLogin)
router.post('/adminLogout', adminLogout)

module.exports = router