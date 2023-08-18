const express = require('express');

const wishListController = require('../controllers/wishListController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/addproducttowishlist', wishListController.addProductToWishList);
router.patch('/removeproductfromwishlist', wishListController.removeProductFromWishList);
router.get('/', wishListController.getMyWishList);


module.exports = router;
