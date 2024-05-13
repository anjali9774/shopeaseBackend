const express = require('express');
const colorController = require('../controllers/colorController');
const {isLoggedIn}  = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/add', isLoggedIn,isAdmin, colorController.createColor);
router.get('/',colorController.getAllColors);
router.get('/:id',colorController.getSingleColor);
router.put('/:id',isLoggedIn, isAdmin,colorController.updateColor);
router.delete('/:id',isLoggedIn,isAdmin,colorController.deleteColor);



module.exports =router;