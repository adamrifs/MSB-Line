const Product = require('../Models/productSchema')
const cloudinary = require('cloudinary').v2
const sharp = require('sharp')

const addProduct = async (req, res) => {
    try {
        const { name, description, price, brand, comparePrice, category, color, stock, isFeatured } = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]

        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined)

        const imageUrl = await Promise.all(
            images.map(async (item) => {
                const compressedBuffer = await sharp(item.path)
                    .resize(1500)
                    .jpeg({ quality: 80 })
                    .toBuffer()

                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: 'image' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url)
                        }
                    ).end(compressedBuffer)
                })
                // let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                // return result.secure_url
            })
        )

        let parsedColor = []
        if (typeof (color) === 'string') {
            parsedColor = JSON.parse(color)
        } else if (Array.isArray(color)) {
            parsedColor = color
        }

        const newProduct = new Product({
            name,
            description,
            price,
            comparePrice,
            category,
            brand,
            color: parsedColor,
            stock,
            isFeatured: isFeatured === 'true' ? true : false,
            image: imageUrl
        })
        await newProduct.save()
        res.status(200).json({ message: 'product added succesfull', newProduct })
    } catch (error) {
        console.log(error, 'error occured on addProduct')
        res.status(500).json({ message: error.message })
    }
}

const listProduct = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({ products })
    } catch (error) {
        console.log(error, 'error occured on listProduct')
        res.status(500).json({ message: error.message })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'product fetched', product })
    } catch (error) {
        console.log(error, 'error occured on singleProduct')
        res.status(500).json({ message: error.message })
    }
}

const editProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, brand, comparePrice, category, color, stock, isFeatured } = req.body

        const existingProduct = await Product.findById(id)
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const image1 = req.files?.image1?.[0] || existingProduct.image[0];
        const image2 = req.files?.image2?.[0] || existingProduct.image[1];
        const image3 = req.files?.image3?.[0] || existingProduct.image[2];
        const image4 = req.files?.image4?.[0] || existingProduct.image[3];
        const image5 = req.files?.image5?.[0] || existingProduct.image[4];

        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined)

        const imageUrl = await Promise.all(
            images.map(async (item) => {
                if (item?.path) {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                }
                return item; // Keep existing image URL
            })
        );

        let parsedColor = []
        if (typeof (color) === "string") {
            parsedColor = JSON.parse(color)
        } else if (Array.isArray(color)) {
            parsedColor = color
        }
        // console.log('parsedcolor:::', parsedColor)

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            description,
            price,
            comparePrice,
            category,
            brand,
            color: parsedColor,
            stock,
            image: imageUrl,
            isFeatured
        }, { new: true })

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: 'product updated succesfully', updatedProduct })
    } catch (error) {
        console.log(error, 'error occured on editProduct')
        res.status(500).json({ message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        await Product.findByIdAndDelete(id)
        res.status(200).json({ message: 'product deleted succesfull' })
    } catch (error) {
        console.log(error, 'error occured on deleteProduct')
        res.status(500).json({ message: error.message })
    }
}

module.exports = { addProduct, listProduct, singleProduct, editProduct, deleteProduct }