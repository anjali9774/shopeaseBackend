const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const {isLoggedIn}  = require('../middlewares/isLoggedIn');
const categoryFileUpload = require("../config/categoryUpload");
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/add', isLoggedIn,isAdmin,categoryFileUpload.single("file"), categoryController.createCategory);
router.get('/',categoryController.getAllCategories);
router.get('/:id',categoryController.getSingleCategory);
router.put('/:id',authController.protect,isAdmin, categoryController.updateCategory);
router.delete('/:id',authController.protect,isAdmin, categoryController.deleteCategory);



module.exports =router;