const Product = require('../model/Product');
const Category = require('../model/Category');
const mongoose = require('mongoose');

exports.uploadImages = async (req, res, next) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        const file = req.file;
        if (!file) return res.status(400).send('No image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();

        if (!product) return res.status(500).send('The product cannot be created');

        res.send(product);
    } catch (error) {
        next(err);
    }
}

exports.updateMoreImagesProduct = async (req, res, next) => {
    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(product);

    } catch (err) {
        next(err);
    }
}
 
// Add products in DB
exports.createProduct = async (req, res, next) => {
    try {
        const { name, image, countInStock, description, richDescription, images,
            brand, price, category, rating, isFeatured, dateCreated
        } = req.body;

        const categoryFind = await Category.findOne({ _id: category });

        if (!categoryFind) {
            const error = new Error(`Invalid category!!`);
            error.statusCode = 400;
            throw error;
        } else {
            if (await Product.findOne({ name })) {
                const error = new Error(`this ${name} already exist !!`);
                error.statusCode = 409;
                throw error;
            } else {

                const product = new Product({
                    name, image, countInStock, description, richDescription, images,
                    brand, price, category, rating, isFeatured, dateCreated
                });

                const result = await product.save();

                if (!result) {
                    const error = new Error(`this product cannot be created!!`);
                    error.statusCode = 404;
                    throw error;
                }

                res.send(result);
            }
        }

    } catch (err) {
        next(err);
    }

}

// Update Product
exports.updateProduct = async (req, res, next) => {

    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const { name, image, countInStock, description, richDescription, images,
            brand, price, category, rating, isFeatured, dateCreated
        } = req.body;

        const product = await Product.findOne({ id });

        var myquery = { id };

        const categoryFind = await Category.findOne({ _id: category });

        const file = req.file;
        let imagepath;

        if (file) {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagepath = `${basePath}${fileName}`;
        } else {
            imagepath = product.image;
        }

        var newvalues = {
            $set: {
                name, image:imagepath, countInStock, description, richDescription, images,
                brand, price, category, rating, isFeatured, dateCreated
            }
        };

        if (!categoryFind) {
            const error = new Error(`Invalid category!!`);
            error.statusCode = 400;
            throw error;
        }
        else if (product) {
            await Product.updateOne(myquery, newvalues, (err, obj) => {
                if (err) {
                    const error = new Error(`this product ${name} can't updated`);
                    error.statusCode = 405;
                    throw error;
                }
            })
        } else {
            const error = new Error(`this product ${name} does not exist`);
            error.statusCode = 401;
            throw error;
        }


    } catch (err) {
        next(err);
    }
};
// delete 

exports.deletProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (mongoose.isValidObjectId(id)) {
            const product = await Product.findOne({ id });

            var myquery = { id };

            if (product) {
                await Product.deleteOne(myquery, (err, obj) => {
                    if (err) {
                        const error = new Error(`this ${id} can't deleted`);
                        error.statusCode = 500;
                        throw error;
                    }
                })
            } else {
                const error = new Error(`this product ${id} does not exist`);
                error.statusCode = 404;
                throw error;
            }

        } else {
            const error = new Error(`this ${id} don't have a good format`);
            error.statusCode = 501;
            throw error;
        }


    } catch (err) {
        next(err);
    }

}

// Return alls products from DB and filter
exports.getProducts = async (req, res) => {

    try {
        let filter = {};
        // url?params1=value1,value2&params2=value1p2,value2p2
        if (req.query.categories) { // query parameters for filter by categories
            filter = { category: req.query.categories.split(',') }
        }

        const products = await Product.find(filter);
        return res.json(products);

    } catch (err) {
        next(err);
    }

};

exports.getProduct = async (req, res, next) => {

    try {
        const id = req.params.id;

        const product = await Product.findOne({ id }).populate('category'); // get product and category details

        return res.json(product);
    } catch (err) {
        next(err);
    }

};

// get products count for Stats purposes
exports.getProductsStats = async (req, res, next) => {

    try {
        console.log('ici');
        const productCount = await Product.countDocuments((count) => count);
        await Product.countDocuments(function (err, count) {
            console.log('there are %d jungle adventures', count);
        });
        // return res.send({ productCount :productCount });

    } catch (err) {
        next(err);
    }

};

// recherche specifique
exports.getProductsFeatured = async (req, res, next) => {

    try {
        const product = await Product.find({ isFeatured: true });
        return res.json({ product });
    } catch (err) {
        next(err);
    }

};

// filter by category

exports.getProductsbyCategory = async (req, res, next) => {

    let filter = {};

    if (req.query.categories) { // query parameters
        filter = { category: req.query.categories.split(',') }
    }
    try {
        const product = await Product.find(filter);
        return res.json({ product });
    } catch (err) {
        next(err);
    }

};