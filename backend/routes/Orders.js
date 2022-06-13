const express = require("express");
const router = express.Router();
const OderController = require('../controllers/Orders');

router.get("/",OderController.getOrders);
router.get("/getOne/:id",OderController.getOrder);
router.post("/",OderController.createOder);
router.put("/:id",OderController.updatetOrder);
router.delete("/:id",OderController.deletetOrder);
router.get("/total",OderController.totalsalesOrder);
router.get("/count",OderController.countOrder);
router.get("/userorders/:userid",OderController.getUserordersByUserIdOrder);

module.exports = router;