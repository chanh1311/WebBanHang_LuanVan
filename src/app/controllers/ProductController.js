const { estimatedDocumentCount } = require('../model/Product');
const Product = require('../model/Product');
const Rate = require('../model/Rate');
const Order = require('../model/Order');
class ProductController {
    // GET /product/:slug
    showDetailOld(req, res, next) {
        const user = req.body.user;
        const message = req.flash('message');
        Product.findOne({ slug: req.params.slug })
            .lean()
            .then((product) => {
                Promise.all([
                    Product.find({ maloaihang: product.maloaihang })
                        .limit(5)
                        .lean(),
                    Rate.find({ idsanpham: product._id }).lean(),
                ])
                    .then(([productRelated, rate]) => {
                        res.render('product/show-detail', {
                            product,
                            productRelated,
                            rate,
                            user,
                            message 
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }


    // GET /product/:slug
    async showDetail(req, res, next) {
        try{
            const user = req.user;
            const message = req.flash('message');
            const product = await Product.findOne({ slug: req.params.slug }).lean();
            const productRelated = await Product.find({ maloaihang: product.maloaihang }).limit(5).lean();
            const rate = await Rate.find({ idsanpham: product._id }).lean();
            // check 
            let productInOrder;
            let checkProductReview;
            if(user){
                checkProductReview = await Rate.find({email: user.email,idsanpham: product._id}).lean();
                if(!checkProductReview || (Array.isArray(checkProductReview) && checkProductReview.length == 0)){
                    productInOrder = await Order.find({email: user.email, 'sanphammua.idProduct': product._id,delivered: true}).lean();
                    checkProductReview = false;
                }
                
            }
            
            
            res.render('product/show-detail', {
                product,
                productRelated,
                rate,
                user,
                message,
                productInOrder,
                checkProductReview
            });
        }catch(error){
            console.log(error);
            next(error);
        }
        
        
        // Product.findOne({ slug: req.params.slug })
        //     .lean()
        //     .then((product) => {
        //         Promise.all([
        //             Product.find({ maloaihang: product.maloaihang })
        //                 .limit(5)
        //                 .lean(),
        //             Rate.find({ idsanpham: product._id }).lean(),
        //         ])
        //             .then(([productRelated, rate]) => {
        //                 res.render('product/show-detail', {
        //                     product,
        //                     productRelated,
        //                     rate,
        //                     user,
        //                     message 
        //                 });
        //             })
        //             .catch(next);
        //     })
        //     .catch(next);
    }




    // GET /product/search
    search(req, res, next) {
        const key = req.query.key;
        Product.find({$text: {$search: key}}).lean()
        .then(product => {
            res.render('categories/show-category',{product,key});
        })
        .catch(next)

        
    }

    // GET /product/create
    create(req, res, next) {
        res.render('product/create');
    }

    // POST /product/store
    store(req, res, next) {
        Product.create(req.body).then(res.redirect('/')).catch(next);
    }

    // GET /product/:id/edit
    edit(req, res, next) {
        Product.findById(req.params.id)
            .lean()
            .then((product) => res.render('product/edit', { product }))
            .catch(next);
    }

    // PUT /product/:id
    update(req, res, next) {
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/product'))
            .catch(next);
    }

    // PATCH /product/:id/restore
    restore(req, res, next) {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // DELETE /product/:id/delete
    // delete of plugins add deleted:true
    destroy(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // DELETE /product/:id/delete-force
    destroyforce(req, res, next) {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // POSY /product/hanlde-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Product.delete({ _id: { $in: req.body.idProduct } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
        }
    }
    // [POST] /product/review/id REview Product
     
    async reviewProduct(req, res, next) {
        try{    
            const idProduct = req.params.id;
            const user = req.user;
            if(!user || !req.body){
                res.redirect('back');
            }else{
                const data = {
                    idsanpham: idProduct,
                    sosao: parseInt(req.body.rating),
                    noidung: req.body.content,
                    email: user.email,
                    hoten: user.fullname
                }

                let rate = new Rate(data);
                await rate.save();
                res.redirect('back');
            }
        }catch(error){
            console.log(error);
            next(error);
        }
        
    }
}

module.exports = new ProductController();
