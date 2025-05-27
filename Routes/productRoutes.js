const express = require('express')
const { addProduct, listProduct, singleProduct, editProduct, deleteProduct } = require('../Controllers/productController')
const upload = require('../Middleware/multer')
const protectRoute = require('../Middleware/adminMiddleware')
const router = express.Router()

router.post('/addProduct', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }]), protectRoute, addProduct)
router.get('/listProduct',  listProduct)
router.get('/singleProduct/:id', protectRoute, singleProduct)
router.put('/editProduct/:id', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }]), protectRoute, editProduct)
router.delete('/deleteProduct/:id',protectRoute, deleteProduct)

module.exports = router