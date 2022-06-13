const express = require("express");
const router = express.Router();
const OrderItemController = require('../controllers/OrderItems');

router.get("/",OrderItemController.getOrderItems);
router.post("/",OrderItemController.createOrderItem);
//router.post("/update",ProductController.updatetUser);

module.exports = router;