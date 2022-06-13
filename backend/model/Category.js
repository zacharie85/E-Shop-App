const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    color:  {
        type:String,
        required:false
    },
    icon:  {
        type:String,
        required:false
    },
    image:  {
        type:String,
        required:false
    },
});

categorySchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

const Category = mongoose.model('Category',categorySchema);

module.exports = Category;