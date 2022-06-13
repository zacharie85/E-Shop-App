const mongoose = require('mongoose');

const OrderItemsSchema = new mongoose.Schema({
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:  {
        type:Number,
        required:true
    },

});

OrderItemsSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

const OrderItem = mongoose.model('OrderItems',OrderItemsSchema);

module.exports = OrderItem;