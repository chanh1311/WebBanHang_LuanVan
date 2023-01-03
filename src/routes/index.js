const sitesRouter = require('./sites');
const productRouter = require('./product');
const userRouter = require('./user');
const cartRouter = require('./cart');
const sliderRouter = require('./api/slider');
const categoryRouter = require('./category');
const checkoutRouter = require('./checkout');
const adminRouter = require('./admin');
function route(app) {
    app.use('/user', userRouter);
    app.use('/cart', cartRouter);
    app.use('/product', productRouter);
    app.use('/slider', sliderRouter);
    app.use('/category', categoryRouter);
    app.use('/checkout', checkoutRouter);
    app.use('/admin', adminRouter);
    app.use('/', sitesRouter);
}

module.exports = route;
