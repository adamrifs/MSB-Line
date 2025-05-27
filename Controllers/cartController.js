const User = require("../Models/userSchema")

const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body
        const user = await User.findById(userId)
        const existingItem = user.cartItems.find((item) => item.product.toString() === productId)
       
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            user.cartItems.push({ product: productId, quantity: 1 })
        }
        await user.save()
        res.status(200).json({ message: 'item added to cart', user })
    } catch (error) {
        console.log(error, 'error occured on addtocart')
        res.status(500).json({ message: error.message })
    }
}

module.exports = { addToCart }