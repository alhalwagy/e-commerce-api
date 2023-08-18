const express = require('express');

const authController = require('../controllers/authController');
const addressController = require('../controllers/addressController')

const router = express.Router();

router.use(authController.protect);

router.route('/').post(addressController.addAddress).get(addressController.getLoggedUserAddresses);

router.delete('/:addressId', addressController.removeAddress);

module.exports = router;
