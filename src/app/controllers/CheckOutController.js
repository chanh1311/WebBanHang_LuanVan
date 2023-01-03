const User = require("../model/User");
const Cart = require("../model/Cart");
const Order = require("../model/Order");
const Product = require("../model/Product");

const paypal = require("../../helper/paypal.js");
const { findById, updateOne } = require("../model/Cart");
class CheckOutController {
    // [POST] /
    async checkOutAll(req, res, next) {
        try{
            const user = req.user;
            let discount = req.body.discount;
            console.log(discount);
            if(!user){
                res.flash('message','Vui lòng đăng nhập để thanh toán!');
                res.redirect('/user/login');
            }else{
                let dataCarts = await Cart.find({emailkhachhang: user.email}).populate('idProduct').select('idProduct soluongdatmua -_id').lean();
               
                let checkSoLuong = dataCarts.every(function(obj){
                    return obj.soluongdatmua <= obj.idProduct.soluong;
                });
                // Custom Product Buy
                let productsBuy = dataCarts.map(function(obj){
                    return {
                        idProduct: obj.idProduct._id,
                        soluongdatmua: obj.soluongdatmua
                    }
                })
                // add address

                if(checkSoLuong){
                    let addressOther = req.body.addressOther;
                    let objAddress;
                    if(addressOther){
                        objAddress = await User.findOneAndUpdate({email: user.email},{ $push: { address: addressOther}}).select('address -_id');
                    }else{
                        objAddress = await User.findOne({email: user.email}).select('address -_id');
                    }
                    
                    const data = {
                        email: user.email,
                        hoten: req.body.fullname,
                        phone: req.body.phone,
                        diachi: addressOther ? addressOther : objAddress.address[parseInt(req.body.address)],
                        tongtien: req.body.total,
                        sanphammua: productsBuy
                    }
                    await Order.create(data);
                    for(const element of dataCarts) {
                        let soluongconlai = element.idProduct.soluong - element.soluongdatmua;
                        await Product.findByIdAndUpdate(element.idProduct._id,{soluong: soluongconlai});
                    }
                    await Cart.deleteMany({emailkhachhang: user.email});
                    // REMOVE MGG
                    if(discount){
                        await User.findOneAndUpdate({email: user.email},{$pull: {
                            code: {
                                key: discount
                            }
                        }});
                    }
                    res.redirect('/checkout/checkout-success');
                }else{
                    req.flash('message','Số lượng sản phẩm đã hết!');
                    res.redirect('/cart/show');
                }
            }

        }catch(error){
            console.log(error);
            next(error);
        }
        
    }

     // [GET] /checkOutSuccess
     async checkOutSuccess(req, res, next) {
        const user = req.user;
        if(!user){
            res.redirect('/user/login');
        }
        res.render('order/checkout-success',{user});
    }

     // [GET] /checkOutSuccess
     async checkOutSuccessPaypal(req, res, next) {
        const user = req.user;
        if(!user){
            res.redirect('/user/login');
        }
        res.render('order/checkout-paypal-success',{user});
    }

    // [POST] checkOutWithPaypal /checkout-paypal
    
    async checkOutWithPaypal(req, res, next) {
        const user = req.user;
        if(!user){
            res.redirect('/user/login');
        }else{
            const totalUSD = req.body.totalUSD;
        
            const order = await paypal.createOrder(totalUSD);
            res.json(order);
        }
        
    }

    async checkOutWithPaypalSuccess(req, res, next) {
        
        const {orderID} = req.params;
        const user = req.user;
        const {fullname,address,addressOther,phone,total,discount} = req.body;
        
        if(!user){
            res.redirect('/user/login');
        }else{
           const email = user.email;
            let dataCarts = [];
            dataCarts = await Cart.find({emailkhachhang: email}).populate('idProduct').select('idProduct soluongdatmua -_id').lean();;
            let productsInCart = dataCarts.map(function(obj){
                return {
                    idProduct: obj.idProduct._id,
                    soluongdatmua: obj.soluongdatmua
                }
            });
            // 
            let objAddress;
            if(addressOther){
                objAddress = await User.findOneAndUpdate({email: user.email},{ $push: { address: addressOther}}).select('address -_id');
            }else{
                objAddress = await User.findOne({email: user.email}).select('address -_id');
            }
            
            const newOrder = new Order({
                email: email ? email : '',
                hoten: fullname ? fullname : '',
                phone: phone ? phone : '',
                diachi: addressOther ? addressOther : objAddress.address[parseInt(address)],
                tongtien: total ? total : '',
                method: 'paypal',
                sanphammua: productsInCart

            });
            // save data
            newOrder.save();
            for(const element of dataCarts) {
                let soluongconlai = element.idProduct.soluong - element.soluongdatmua;
                await Product.findByIdAndUpdate(element.idProduct._id,{soluong: soluongconlai});
            }
            // delete orders in cart
            await Cart.deleteMany({emailkhachhang: user.email});
              // REMOVE MGG
            if(discount){
                await User.findOneAndUpdate({email: user.email},{$pull: {
                    code: {
                        key: discount
                    }
                }});
            }
            const captureData = await paypal.capturePayment(orderID);
            res.json(captureData);

                
        }
         



            
       
    }
    //
    // [GET] /change-address/:id
     async changeAddress(req, res, next) {
        const user = req.user;
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            const id = req.params.id;
            let order = await Order.findById(id).lean();
            res.render('order/change-address',{user,order,message});
        }
        
    }
      // [POST] /change-address/:id
      async changeAddressToDB(req, res, next) {
        const user = req.user;
        const {phone,diachi} = req.body;
        const id = req.params.id;
        if(!user){
            res.redirect('/user/login');
        }else{
            if(phone && diachi){
                await Order.findByIdAndUpdate(id,{phone,diachi});
                req.flash('message','Cập nhật thông tin thành công!');
                res.redirect('back');
            }
        }
        
    }
    
}
module.exports = new CheckOutController();