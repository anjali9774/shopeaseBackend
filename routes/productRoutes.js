const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');
const upload = require("../config/fileUpload");


// Your route handler

const router = express.Router();

router.post("/createproduct", isLoggedIn,isAdmin ,upload.array("files"),productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSingleProduct);
router.put("/:id", isLoggedIn, isAdmin,productController.updateProduct);
router.delete("/:id", isLoggedIn, isAdmin,productController.deleteProduct);

module.exports = router;
