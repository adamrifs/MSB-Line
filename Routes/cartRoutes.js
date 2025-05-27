const express = require('express')
const { addToCart } = require('../Controllers/cartController')
const router = express.Router()

router.post('/addToCart',addToCart)

module.exports = router