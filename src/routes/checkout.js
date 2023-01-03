const express = require('express');
const router = express.Router();

const checkOutController = require('../app/controllers/CheckOutController');


router.post('/', checkOutController.checkOutAll);
router.get('/checkout-success', checkOutController.checkOutSuccess);
router.get('/checkout-paypal-success', checkOutController.checkOutSuccessPaypal);
router.post('/checkout-paypal',checkOutController.checkOutWithPaypal);
router.post('/:orderID/checkout-paypal-success',checkOutController.checkOutWithPaypalSuccess);
router.get('/change-address/:id', checkOutController.changeAddress);
router.post('/change-address/:id', checkOutController.changeAddressToDB);
// router.get('/checkout-paypal-cancel',checkOutController.checkOutWithPaypalCancel);
module.exports = router;
