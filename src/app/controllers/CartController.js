const mongoose = require('mongoose');
const Cart = require('../model/Cart');
const { findById } = require('../model/Product');
const Product = require('../model/Product');
const User = require('../model/User');

class CartController {
    // [GET] Show Cart
    async show(req,res,next) {
        var user = req.user;
        const message = req.flash('message');
        if(user){
            try{
                // get arr(idproduct) from Cart with email 
                
                let arrOrders = await Cart.find({emailkhachhang: user.email});
                let arrId = arrOrders.map(function(obj){
                   return obj.id;
                })
                // Join model Cart with Product by idProduct
                let arrProduct = await Cart.find().where('_id').in(arrId).populate('idProduct').lean().exec();

                // get count product
                let countProduct = arrProduct.length;

             
                // Convert data simple for display
                let productsInCart = arrProduct.map(function(obj){
                    return {
                        ...obj.idProduct,
                        soluongdatmua: obj.soluongdatmua
                    }
                });

                // get total Price
                let totalPrice = productsInCart.reduce(function(total,obj){
                    return total + obj.gia*obj.soluongdatmua;
                },0)
                
                
                res.render('cart/cart',{user,productsInCart,totalPrice,countProduct,message});
            }catch(error){
                console.log(error);
                next(error);
            }       
            
            
        }else{
            req.flash('message','Cần đăng nhập để mua sản phẩm!');
            res.redirect('/user/login');
        }
            
    }
        
    async applyCode(req,res,next) {
        try{
            const user = req.user;
            const code = req.body.code;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!code){
                    redirect('back');
                }else{
                    let arrCodeUser = await User.findOne({email: user.email}).select('code -_id').lean();
                    let result;
                    for(let object of arrCodeUser.code ){
                        if(object.key == code){
                            result = object.value;
                            break;
                        }
                    }
                    
                    res.send({response: result});
                }
            }
        
        }catch(error){
            console.log(error);
            next(error);
        }
        
    }    
    

    // [GET] ADD PRODUCT
    async addProduct(req, res,next) {
        const reqId = req.params.id;   
        const user = req.user;
        
        if(!user)
            res.redirect('/user/login');
        else
            if(reqId){
                try{

                    let numProductById = await Product.findById(reqId).select('soluong -_id').lean();
                    let numProductBuy = await Cart.findOne({emailkhachhang: user.email,idProduct: reqId}).select('soluongdatmua -_id').lean();
                    
                   
                    // so luong dat mua bang hoac lon hon so luong con lai
                    if(numProductById && numProductBuy && numProductBuy.soluongdatmua >= numProductById.soluong){
                        req.flash('message','Không thể thêm số lượng sản phẩm, số lượng sản phẩm đã đạt mức tối đa!');
                        
                        res.redirect('/cart/show');
                    }else{
                        let query = { $and:[{emailkhachhang: user.email},{idProduct: mongoose.Types.ObjectId(reqId)}]};
                        let update = { $inc : {'soluongdatmua' : 1}};
                        let options = { new: true, setDefaultsOnInsert: true,upsert: true};
                        await Cart.findOneAndUpdate(query, update, options);
                        
                        res.redirect('back');
                    }

                }catch(error){
                    next(error);
                }
            }else{
                res.redirect('back');
            }
            
        
    }

    

      // [GET] REDUCE PRODUCT
    async reduceProduct(req, res,next) {
    const reqId = req.params.id;   
    const user = req.user;
    if(!user)
        res.redirect('/user/login');
    else
        if(reqId){
            try{
                let numProductById = await Product.findById(reqId).select('soluong -_id').lean();
                let numProductBuy = await Cart.findOne({emailkhachhang: user.email,idProduct: reqId}).select('soluongdatmua -_id').lean();
                // soluong dat mua bang 1 giam xuong 0 
                console.log(numProductBuy.soluongdatmua);
                if(numProductById && numProductBuy && numProductBuy.soluongdatmua ==  1){
                    await Cart.findOneAndDelete({idProduct: reqId});
                    
                }else{
                    let query = { $and:[{emailkhachhang: user.email},{idProduct: mongoose.Types.ObjectId(reqId)}]};
                    let update = { $inc : {'soluongdatmua' : -1}};
                    let options = { new: true, setDefaultsOnInsert: true,upsert: true};
                    await Cart.findOneAndUpdate(query, update, options);
                            
                }
                res.redirect('back');
            }catch(error){
                next(error);
            }
        }else{
            res.redirect('back');
        }
        // Thêm thông báo

        
    
    }


     // [GET] BUY PRODUCT
     async buyProduct(req, res,next) {
        const reqId = req.params.id;
        const user = req.user;
        
        if(!user){
            req.flash('message','Cần đăng nhập để mua sản phẩm!');
            res.redirect('/user/login');
        }
        else
            if(reqId){
                try{
                    let numProductById = await Product.findById(reqId).select('soluong slug -_id').lean();
                    let numProductBuy = await Cart.findOne({emailkhachhang: user.email,idProduct: reqId}).select('soluongdatmua -_id').lean();
                    
                    if(!numProductBuy){
                        numProductBuy = {soluongdatmua: 0}
                    }
                    
                    if(numProductById && numProductBuy && numProductBuy.soluongdatmua >= numProductById.soluong){
                        req.flash('message','Không thể thêm sản phẩm, sản phẩm vừa hết!');
    
                        res.redirect(`/product/${numProductById.slug}`);
                    }else{
                        let query = { $and:[{emailkhachhang: user.email},{idProduct: mongoose.Types.ObjectId(reqId)}]};
                        let update = { $inc : {'soluongdatmua' : 1}};
                        let options = { new: true, setDefaultsOnInsert: true,upsert: true};
                        await Cart.findOneAndUpdate(query, update, options);
                        res.redirect('/cart/show');
                    }
                    
                             
                }catch(error){
                    next(error);
                }
            }
            
        
    }

    // [GET] ADD PRODUCT TO CART
    async addProductToCart(req, res,next) {
        const reqId = req.params.id;   
        const user = req.user;
        
        if(!user)
            res.redirect('/user/login');
        else
            if(reqId){
                try{

                    let numProductById = await Product.findById(reqId).select('soluong slug -_id').lean();
                    let numProductBuy = await Cart.findOne({emailkhachhang: user.email,idProduct: reqId}).select('soluongdatmua -_id').lean();
                    if(!numProductBuy){
                        numProductBuy = {soluongdatmua: 0}
                    }
                    
                    if(numProductById && numProductBuy && numProductBuy.soluongdatmua >= numProductById.soluong){
                        req.flash('message','Không thể thêm sản phẩm, sản phẩm vừa hết!');
    
                        res.redirect(`/product/${numProductById.slug}`);
                
                    }else{
                        let query = { $and:[{emailkhachhang: user.email},{idProduct: mongoose.Types.ObjectId(reqId)}]};
                        let update = { $inc : {'soluongdatmua' : 1}};
                        let options = { new: true, setDefaultsOnInsert: true,upsert: true};
                        await Cart.findOneAndUpdate(query, update, options);
                        
                        res.redirect('back');
                    }

                }catch(error){
                    next(error);
                }
            }else{
                res.redirect('back');
            }
            
        
    }

    // [POST] ADD PRODUCT TO CART WITH AJAX
    async addProductToCartNew(req, res,next) {
        const reqId = req.body.idProduct;   
        const user = req.user;
        
        if(!user){
            res.send({notLogin: true});
        }else
            if(reqId){
                try{

                    let numProductById = await Product.findById(reqId).select('soluong slug -_id').lean();
                    let numProductBuy = await Cart.findOne({emailkhachhang: user.email,idProduct: reqId}).select('soluongdatmua -_id').lean();
                    if(!numProductBuy){
                        numProductBuy = {soluongdatmua: 0}
                    }
                    
                    if(numProductById && numProductBuy && numProductBuy.soluongdatmua >= numProductById.soluong){
                        //
                        // req.flash('message','Không thể thêm sản phẩm, sản phẩm vừa hết!');
                        
                        res.send({status: false});
                        
                    }else{
                        let query = { $and:[{emailkhachhang: user.email},{idProduct: mongoose.Types.ObjectId(reqId)}]};
                        let update = { $inc : {'soluongdatmua' : 1}};
                        let options = { new: true, setDefaultsOnInsert: true,upsert: true};
                        await Cart.findOneAndUpdate(query, update, options);
                        
                        res.send({status: true});
                    }

                }catch(error){
                    next(error);
                }
            }else{
                res.redirect('back');
            }
            
        
    }

      // [Delete] DELETE PRODUCT FROM CART
    async deleteProductInCart(req, res,next) {
        const user = req.user;
        let idProduct = req.params.id;
        if(!user){
            res.redirect('/user/login');
        }
        if(idProduct){
            await Cart.findOneAndRemove({idProduct});
        }
        res.redirect('back');
    }
}

module.exports = new CartController();
