const express = require("express");
const router = express.Router();
const UserController = require('../controllers/Users');

router.get("/",UserController.getUsers);
router.get("/:id",UserController.getUser);
//router.post("/add",UserController.createUser);
//router.post("/update",ProductController.updatetUser);

module.exports = router;