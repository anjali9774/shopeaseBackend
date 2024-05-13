const express = require('express');
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/profile', isLoggedIn, userController.getUser);
router.put('/update/shipping', isLoggedIn, userController.updateShippingAddress);

module.exports = router;
