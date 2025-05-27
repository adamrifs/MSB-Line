const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    comparePrice: {
        type: Number,
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
    },
    image: {
        type: Array,
        required: true
    },
    color: [{
        name: { type: String },
        hex: { type: String },
        stock: { type: Number }
    }],
    stock: {
        type: Number,
        required: true
    },
    isFeatured: {
        type: Boolean
    }
},
    { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product