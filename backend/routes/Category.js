const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/Category');

router.get("/",CategoryController.getAllCategories);
router.get("/:id",CategoryController.getOneCategorie);
router.post("/",CategoryController.createCategory);
router.delete("/:id",CategoryController.deletCategory);
router.put("/:id",CategoryController.updateCategorie);

module.exports = router;