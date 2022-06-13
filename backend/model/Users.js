const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:  {
        type:String,
        required:true
    },
    password:  {
        type:String,
        required:true
    },
    street:  {
        type:String,
        required:false
    },
    apartment:  {
        type:Number,
        required:false
    },  
    city:  {
        type:String,
        required:false
    },
    zip:  {
        type:String,
        required:false
    },
    country:  {
        type:String,
        required:false
    },
    phone:  {
        type:Number,
        required:false
    },
    isAdmin:  {
        type:Boolean,
        required:true
    },

});

usersSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

const User = mongoose.model('Users',usersSchema);

module.exports = User;