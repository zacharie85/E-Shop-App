const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    orderItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OrderItems',
        required:true
    }],
    shippingAddress1:  {
        type:String,
        required:true
    },
    shippingAddress2:  {
        type:String,
        required:true
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
    status:  {
        type:String,
        required:false,
        default:'Pending'
    },
    totalPrice:  {
        type:Number,
        required:true
    },
    user:  {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    dateOrdered:  {
        type:Date,
        default:Date.now()
    },

});

ordersSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

const Order = mongoose.model('Orders',ordersSchema);

module.exports = Order;