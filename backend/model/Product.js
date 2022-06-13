const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    image:  {
        type:String,
        required:true
    },
    countInStock:  {
        type:Number,
        required:true
    },
    description:  {
        type:String,
        required:false
    },
    richDescription:  {
        type:String,
        required:false
    },
    images:  [{
        type:String,
    }],
    brand:  {
        type:String,
        required:false
    },
    price:  {
        type:Number,
        default:''
    },
    category:  {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    rating:  {
        type:Number,
        required:false
    },
    isFeatured:  {
        type:Boolean,
        required:false
    },
    dateCreated:  {
        type:Date,
        default:Date.now()
    },

});

// changing _id to id or fontend
productSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;