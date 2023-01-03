const express = require('express');
var passport = require('passport');
const router = express.Router();

const initPassportLocal = require('../app/middlewares/passportLocal')
const initPassportFacebook = require('../app/middlewares/passportFacebook')
const userController = require('../app/controllers/UserController');

initPassportLocal();
initPassportFacebook();

router.get('/history-order/detail-product/:id', userController.detailProductOrder);
router.get('/history-order', userController.history_order);
router.patch('/cancel-order/:id', userController.cancelOrder);
router.get('/profile', userController.profile);
router.get('/code', userController.getCode);
router.get('/change-password', userController.changePassword);
router.post('/change-password', userController.changePasswordToDB);
router.post('/profile/edit', userController.profileEdit);
router.delete('/profile/delete/:address', userController.profileDeleteAddress);
router.get('/login',userController.showLogin);
router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/user/login',
        }),userController.authLogin
    );

router.get('/auth/facebook/cb', passport.authenticate('facebook', { 
                failureRedirect: '/user/login',
                successReturnToOrRedirect: '/',
                keepSessionInfo: true,
            })
        );

router.get('/auth/facebook',passport.authenticate('facebook', {scope: ['email','user_gender']}));
router.get('/logout',userController.logOut);
router.get('/register',userController.showRegister);
router.post('/register',userController.register);
module.exports = router;
