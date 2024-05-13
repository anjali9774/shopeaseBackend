const express = require('express');
const orderController = require('../controllers/orderController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const router = express.Router();

router.post('/', isLoggedIn, orderController.createOrder);
router.get('/', isLoggedIn, orderController.getAllOrders);
router.get('/:id', isLoggedIn, orderController.getSingleOrder);
router.put('/update/:id', isLoggedIn, orderController.updateOrder);
router.get('/sales/stats', isLoggedIn, orderController.getOrderStatus);
router.delete('/delete/:id', isLoggedIn, orderController.deleteOrder);



module.exports = router;