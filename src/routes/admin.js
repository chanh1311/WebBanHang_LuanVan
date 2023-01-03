const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');


router.get('/', adminController.home);
router.get('/show-product', adminController.showProduct);
router.get('/product-detail/:id', adminController.showDetailProduct);
router.delete('/delete-product/:id', adminController.deleteProduct);
router.get('/add-product', adminController.addProduct);
router.post('/add-product', adminController.addProductToDb);
router.get('/update-product/:id', adminController.updateProduct);
router.put('/update-product/:id', adminController.updateProductToDb);

router.post('/user/add-code', adminController.addCode);
router.get('/list-user', adminController.getListUser);
router.put('/lock-user/:id',adminController.lockUser);
router.put('/unlock-user/:id',adminController.unLockUser);
router.get('/list-order',adminController.getListOrder);
router.get('/list-order/list-product/:id',adminController.getListProductInOrder);

router.patch('/confirm-order/:id',adminController.confirmOrder);
router.patch('/cancel-order/:id',adminController.cancelOrder);
router.patch('/confirm-order-success/:id',adminController.confirmOrderSuccess);
// categories
router.get('/list-categories',adminController.getListCategories);
router.post('/add-category',adminController.addCategory);
// statistical
router.get('/statistical',adminController.showStatistical);
router.post('/statistical-by-date',adminController.statisticalByDate);
// account
router.get('/add-account',adminController.addAccount);
router.post('/add-account',adminController.addAccountToDB);
router.get('/list-account',adminController.getListAccount);
// lock account
router.put('/lock-account/:id',adminController.lockAccount);
router.put('/unlock-account/:id',adminController.unLockAccount);
// change permistion
router.put('/add-permistion-edit/:id',adminController.addPermistionEdit);
router.put('/remove-permistion-edit/:id',adminController.removePermistionEdit);
// 

module.exports = router;
