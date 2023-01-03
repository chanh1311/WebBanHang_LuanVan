const User = require('../model/User');
const Order = require('../model/Order');
const Product = require('../model/Product');
const bcrypt = require('bcrypt');
const url = require('url');




class UserController {
    // [GET] 
    async profile(req, res) {
        const user = req.user;
        if(!user){
            res.redirect('/user/login');
        }else{
            let infoUser = await User.findOne({email: user.email}).lean()
            res.render('user/profile',{user,infoUser});
        }
    }
      // [POST] 
    async profileEdit(req, res) {
        // chua validate phia client
        const user = req.user;
        if(!user){
            res.redirect('/user/login');
        }else{
            let newAddress = req.body.newaddress;
            let { newaddress, ...data } = req.body;
            if(newAddress){
                var address = [...req.body.address,newaddress];
                data = {
                    ...data,
                    address: address
                }
            }
            
            await User.findOneAndUpdate({email: user.email},data);
            res.redirect('back');
        }
    }

        // [POST] 
    async profileDeleteAddress(req, res) {
        const user = req.user;
        let addressId = parseInt(req.params.address);
        const queryAddress = await User.findOne({email: user.email}).select('address -_id').lean();
        let arrAddress = queryAddress.address;

        if(!user){
            req.flash('message','Cần đăng nhập để thực hiện!');
            res.redirect('/user/login');
        }else{
            await User.updateOne({email: user.email},{$pull: {
                address: arrAddress[addressId],
            },});
            res.redirect('back');
        }
    }
    // [GET] chitiet
    async history_order(req, res,next) {
        try{
            const user = req.user;
            
            if(!user){
                res.redirect('/user/login');
            }else{
                const orders = await Order.find({email: user.email}).populate('sanphammua.idProduct').lean();
            
                res.render('user/history-order',{orders,user});
            }
          
        }catch(error){
            console.log(error);
            next(error);
        }
        
    }
    // GET login
    showLogin(req,res){
        const message = req.flash('message');
        res.render('user/login',{layout: false,message});
    }
   

     // GET login
    logOut(req,res,next){
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('back');
        });
    }
    
    // GET register
    showRegister(req,res){
        const message = req.flash('message');
        res.render('user/register',{layout: false,message});
    }
    // POST register
    register(req,res,next){
        
        const email = req.body.email;
        const SALT_ROUNDS = 10;
        const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

        const newUser = {
            ...req.body,
            password: hashPassword,
        }

        User.findOne({email})
        .then(
            (user) => {
                if(user){
                    
                    req.flash('message','Tài khoản email đã tồn tại, vui lòng nhập email khác!');
                    res.redirect('back');
                }else{
                    User.create(newUser).then(() => {
                        req.flash('message','Đăng kí tài khoản thành công, vui lòng đăng nhập để mua hàng!');
                        res.redirect("/user/login");
                    })
                    .catch(next)
                }                    
            }
        )
        .catch(
            next
        )
    }
    async detailProductOrder(req,res,next){
        try{
            const user = req.user;
            const id = req.params.id;
           
            let dataOrders;
            if(!user){
                res.redirect('/user/login');
            }
            if(id){
                dataOrders = await Order.findById(id).populate('sanphammua.idProduct').lean();
            }
            let productInOrders =  dataOrders.sanphammua;
                
            res.render('order/listProduct',{productInOrders});
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    authLogin(req,res,next){
        if (req.user.isAdmin === true) {
            res.redirect('/admin');
          }
        else{
            res.redirect('/');
        }
    }

     // PATCH /user/cancel-order/id
     async cancelOrder(req,res,next) {
        
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                
                if(id){
                    let objArrProductsBuy = await Order.findByIdAndUpdate(id,{ $unset: { status: true },cancelOrderAt: Date.now()},{new:true,select:{sanphammua: 1,_id: 0}});
                    //
                    let arrProductsBuy;
                    
                    if(objArrProductsBuy){
                        arrProductsBuy = objArrProductsBuy.sanphammua;
                    }
                    
                    if(arrProductsBuy && Array.isArray(arrProductsBuy)){
                        for(let obj of arrProductsBuy){
                            await Product.findByIdAndUpdate(obj.idProduct,{ $inc : {soluong: obj.soluongdatmua}});
                        }
                    }
                    
                }
                res.redirect('back');
                
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    // Show code
      // [GET] 
    async getCode(req, res) {
        const user = req.user;
        if(!user){
            res.redirect('/user/login');
        }else{
            let infoCode = await User.findOne({email: user.email}).select('code').lean()
            res.render('user/show-code',{user,infoCode});
        }
    }

    // change password
    // [GET] /user/change-password
    async changePassword(req, res) {
        const user = req.user;
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            
            res.render('user/change-password',{layout: false,user,message});
        }
    }

     // change password
     // [POST] /user/change-password
     async changePasswordToDB(req, res) {
        const user = req.user;
        const {email,password,newpassword} = req.body;
        const SALT_ROUNDS = 10;
        
        if(!user){
            res.redirect('/user/login');
        }else{
            if(email){
                let account = await User.findOne({email, isFacebook: {$in: [null,false]}}).lean();
                if(!account){
                    req.flash('message','Tài khoản không tồn tại!');
                    res.redirect('back');
                }else{
                    let checkPassword = await bcrypt.compare(password,account.password);
                    if(!checkPassword){
                        req.flash('message','Tài khoản hoặc mật khẩu không chính xác, hãy thử lại!');
                        res.redirect('back');
                    }else if(password == newpassword){
                        req.flash('message','Mật khẩu mới trùng với mật khẩu cũ, hãy thử lại!');
                        res.redirect('back');
                    }else{
                        const hashNewPassword = bcrypt.hashSync(newpassword, SALT_ROUNDS);
                        await User.updateOne({email},{password: hashNewPassword})
                        req.flash('success','Thay đổi mật khẩu thành công!');
                        res.redirect('back');
                    }

                }
            }
            
        }
    }

}

module.exports = new UserController();
