const Category = require('../model/Category');

// Add products in DB
exports.createCategory = async (req, res, next) => {
    try {
        const { name, color,icon, image} = req.body;

        if (await Category.findOne({ name })) {
            const error = new Error(`this ${name} already exist !!`);
            error.statusCode = 409;
            throw error;
        } else {

            const category = new Category({ name, color,icon,image });

            const result = await category.save();

            if(!result){
                const error = new Error(`this category cannot be created!!`);
                error.statusCode = 404;
                throw error;
            }
            res.send(result);
        }

    } catch (err) {
        next(err);
    }

}


exports.deletCategory = async (req, res, next) => {
    try {
        const id = req.params.id;

        const categorie = await Category.findOne({ id });

        var myquery = {id};

        if (categorie) {
             await Category.deleteOne(myquery,(err,obj)=>{
                if (err){
                    const error = new Error(`this ${id} can't deleted`);
                    error.statusCode = 404;
                    throw error;
                } 
             })
        } else {
            const error = new Error(`this category ${id} does not exist`);
            error.statusCode = 404;
            throw error;
        }


    } catch (err) {
        next(err);
    }

}

// Return alls Category from DB
exports.getAllCategories = async (req, res,next) => {

    try {
        const categories = await Category.find({});

        return res.json(categories);
    } catch (err) {
        next(err);
    }

};

// Return only one category
exports.getOneCategorie = async (req, res,next) => {

    try {
        const id = req.params.id;

        const categorie = await Category.findOne({id});

        return res.json(categorie);
    } catch (err) {
        next(err);
    }

};

exports.updateCategorie = async (req, res,next) => {

    try {
        const id = req.params.id;

        const { name, color,icon, image} = req.body;

        const categorie = await Category.findOne({ id });

        var myquery = {id};

        var newvalues = { $set: {name, color,icon,image } };

        if (categorie) {
             await Category.updateOne(myquery,newvalues,(err,obj)=>{
                if (err){
                    const error = new Error(`this ${name} can't updated`);
                    error.statusCode = 405;
                    throw error;
                } 
             })
        } else {
            const error = new Error(`this categpry ${name} does not exist`);
            error.statusCode = 401;
            throw error;
        }


    } catch (err) {
        next(err);
    }
};

