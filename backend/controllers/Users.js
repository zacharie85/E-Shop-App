const User = require('../model/Users');

exports.updatetUser = async (req, res, next) => {
    try {
        const { name, street, email,apartment,city,zip,country, phone,isAdmin} = req.body;

        const user = await User.findOne({ email });

        var myquery = { email };
        var newvalues = { $set: { name, street, email,apartment,city,zip,country, phone,isAdmin } };

        if (user) {
            await User.updateOne(myquery, newvalues, (err, obj) => {
                if (err) {
                    const error = new Error(`this ${email} can't updated`);
                    error.statusCode = 405;
                    throw error;
                }
            })
        } else {
            const error = new Error(`this email ${email} does not exist`);
            error.statusCode = 401;
            throw error;
        }


    } catch (err) {
        next(err);
    }

}

exports.deletUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        var myquery = { email };

        if (user) {
            await User.deleteOne(myquery, (err, obj) => {
                if (err) {
                    const error = new Error(`this ${email} can't deleted`);
                    error.statusCode = 403;
                    throw error;
                }
            })
        } else {
            const error = new Error(`this email ${email} does not exist`);
            error.statusCode = 401;
            throw error;
        }


    } catch (err) {
        next(err);
    }

}

exports.getUsers = async (req, res, next) => {

    try {
        const usersFromDb = await User.find({}).select('-password'); // all users without password field
        return res.sent(usersFromDb);
    } catch (error) {
        next(err);
    }
};

// get all users
exports.getUser = async (req, res, next) => {

    try {
        const id = req.params.id;

        const userFromDb = await User.findOne({_id : id}).select('-password'); // all users without password field
        return   res.send(userFromDb)
    } catch (error) {
        next(err);
    }
};