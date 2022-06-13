const Order = require('../model/Orders');
const OrderItem = require('../model/OrderItems');
const mongoose = require('mongoose');
// get users orders
exports.getUserordersByUserIdOrder = async (req, res, next) => {
    try {
        const userOrderList = await Order.find({user: req.params.userid}).populate({ 
            path: 'orderItems', populate: {
                path : 'product', populate: 'category'} 
            }).sort({'dateOrdered': -1});
    
        if(!userOrderList) {
            res.status(500).json({success: false})
        } 
        res.send(userOrderList);
    } catch (error) {
        next(error);
    }
   
}

// get number of orders 
exports.countOrder = async (req, res, next) => {
    try {
        const orderCount = await Order.countDocuments((count) => count)

        if(!orderCount) {
            res.status(500).json({success: false})
        } 
        res.send({
            orderCount: orderCount
        });
    } catch (error) {
        next(error);
    }
   
}
// get total Sales order 
exports.totalsalesOrder = async (req, res, next) => {
    try {
        const totalSales= await Order.aggregate([
            { $group: {_id:  mongoose.Types.ObjectId('51bb793aca2ab77a3200000d') , totalsales :{ $sum : '$totalPrice'}}}
        ])
    

        if(!totalSales) {
            return res.status(400).send('The order sales cannot be generated')
        }
    
        res.send({totalsales: totalSales.pop().totalsales})
    } catch (error) {
        next(error);
    }
   
}
// delete order and orderItems
exports.deletetOrder = async (req, res, next) => {
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
}

// update order 
exports.updatetOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        )

        if (!order)
            return res.status(400).send('the order cannot be update!')

        res.send(order);
    } catch (error) {
        next(error);
    }
}

// Add orders in DB
exports.createOder = async (req, res, next) => {
    try {
        console.log(req.body);
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        }))
        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        order = await order.save();

        if (!order)
            return res.status(400).send('the order cannot be created!')

        res.send(order);
    } catch (err) {
        next(err);
    }

}

// Return alls orders from DB
exports.getOrders = async (req, res, next) => {

    try {
        const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

        if (!orderList) {
            res.status(500).json({ success: false })
        }
        res.send(orderList);

    } catch (err) {
        next(err);
    }

};

// return on order

exports.getOrder = async (req, res, next) => {

    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category'
                }
            });

        if (!order) {
            res.status(500).json({ success: false })
        }
        res.send(order);

    } catch (err) {
        next(err);
    }

};

/* {
    "orderItems":[
        
            "quantity": 12,
            "product" : "629d2553c6684df59d362442"
        },
         {
            "quantity": 9,
            "product" : "629d2dabf6208f5ec2f82811"
        },
    ],
    "shippingAddress1" : "56 rue king",
    "shippingAddress2" : "67 rue king",
    "totalPrice" : 123,
    "User" : "629f75c344bc70a9caef6bd9"
} */