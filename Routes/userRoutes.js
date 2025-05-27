const express = require('express')
const { userRegister, userLogin } = require('../Controllers/userController')
const authProtectRoute = require('../Middleware/authMiddleware')
const router = express.Router()

router.post('/userRegister', userRegister)
router.post('/userLogin',  userLogin)

module.exports = router