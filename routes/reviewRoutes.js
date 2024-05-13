const express = require('express');
const reviewController = require('../controllers/reviewController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const router = express.Router();


router.post("/:productID", isLoggedIn, reviewController.createReview);

module.exports =router;