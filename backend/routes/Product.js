const express = require("express");
const router = express.Router();
const ProductController = require('../controllers/Product');

const multer = require('multer'); // for upload files

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get("/",ProductController.getProducts);
router.get("/featured",ProductController.getProductsFeatured);
router.post("/",uploadOptions.single('image'),ProductController.uploadImages);
router.get("/getOne/:id",ProductController.getProduct);
router.put("/:id",uploadOptions.single('image'),ProductController.updateProduct);
router.put("/gallery-images/:id",uploadOptions.array('image'),ProductController.updateMoreImagesProduct);
router.delete("/:id",ProductController.deletProduct);

module.exports = router;