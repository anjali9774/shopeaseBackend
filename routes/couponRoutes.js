const express = require('express');
const couponController = require('../controllers/couponController');
const {isLoggedIn}  = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/add', isLoggedIn, couponController.createCoupon);
router.get('/',couponController.getAllCoupons);
router.get('/single',couponController.getCoupon);
router.put('/update/:id',isLoggedIn, isAdmin ,couponController.updateCoupon);
router.delete('/delete/:id',isLoggedIn,isAdmin, couponController.deleteCoupon);



module.exports =router;