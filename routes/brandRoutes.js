const express = require('express');
const brandController = require('../controllers/brandContoller');
const {isLoggedIn}  = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/add', isLoggedIn, isAdmin,brandController.createBrand);
router.get('/',brandController.getAllBrands);
router.get('/:id',brandController.getSingleBrand);
router.put('/:id',isLoggedIn, isAdmin,brandController.updateBrand);
router.delete('/:id',isLoggedIn, isAdmin, brandController.deleteBrand);



module.exports =router;