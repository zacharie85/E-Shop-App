const User = require('../model/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretPassword = process.env.secretPassword;

exports.createUser = async (req, res, next) => {
    try {
        const { name, street, email, password,apartment,city,zip,country, phone,isAdmin} = req.body;

        if (await User.findOne({ email })) {
            const error = new Error(`this ${email} already exist !!`);
            error.statusCode = 409;
            throw error;
        } else {

            const haschedPassword = await bcrypt.hash(password, 12);

            const user = new User({ name, street, email,apartment,city,zip,country, phone,isAdmin,password: haschedPassword });

            const result = await user.save();
            res.send(result);
        }

    } catch (err) {
        next(err);
    }

};

exports.loginUser = async (req, res, next) => {
    try {
        const { name, street, email, password,apartment,city,zip,country, phone,isAdmin} = req.body;

        const user = await User.findOne({ email });

        if (user) {

            const isPasswordCorect = await bcrypt.compare(password, user.password);

            if (isPasswordCorect) {

                const token = jwt.sign({email:user.email,isAdmin:user.isAdmin},secretPassword);

                return res.json({ token: token });
            }

            const error = new Error(`Password dos not match email ${email}`);
            error.statusCode = 401;
            throw error;
        } else {
            const error = new Error(`this email ${email} does not exist`);
            error.statusCode = 404;
            throw error;
        }


    } catch (err) {
        next(err);
    }
}