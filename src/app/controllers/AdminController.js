const { findOneAndUpdate } = require('../model/Product');
const Product = require('../model/Product');
const User = require('../model/User');
const Order = require('../model/Order');
const Category = require('../model/Category');
var moment = require('moment');
const bcrypt = require('bcrypt');
class AdminController {
    // [GET] /
    async home(req,res,next) {
        
        const user = req.user;
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else{
                let objCountByCategory = {};
                let objTotalWeek = {};
                let objTotalByCategory = {};
                // tong doanh thu 7 ngay truoc
                let total;
                
                let now = new Date();
                // change -7
                let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
                let totalToday = await Order.find({delivered: true,deliveredAt: {$gte: startOfToday}}).lean();

                if(totalToday && Array.isArray(totalToday)){
                    total = totalToday.reduce((total,obj) => total + obj.tongtien,0);
                }
                // soluong don hang 7 ngay truoc
                let countToDay = totalToday.length;
                // don hang moi
                let newOrder = await Order.count({status: false});
                // don hang dang giao
                let deliveryOrder = await Order.count({status: true});
                // top 10 san pham
                let topProduct = await Product.find({}).sort({soluongmua: -1}).limit(10).lean();
                
                // san pham duoc mua theo thuong hieu
                let productBuyByCategory = await Category.find({}).lean();

                // san pham hien co theo tung thuong hieu
                let products = await Product.find({}).lean();
                products.forEach(function(v) {
                    objCountByCategory[v.maloaihang] = (objCountByCategory[v.maloaihang] || 0) + 1;
                });
                // Doanh thu 7 ngày qua
                now.setDate(now.getDate()-7);
                let ordersDay = await Order.find({deliveredAt: {$gt: now}}).sort({deliveredAt: 1}).lean();
                
                ordersDay.forEach(function(v) {
                    objTotalWeek[moment(v.deliveredAt).format('l')] = (objTotalWeek[moment(v.deliveredAt).format('l')] || 0) + v.tongtien;
                    
                });
                // Doanh thu theo thuong hieu
                let orders = await Order.find({delivered: true}).populate('sanphammua.idProduct').lean();

                let arrOrder = orders.map(obj => {
                    return obj.sanphammua;
                })
                
                for(let arr of arrOrder){
                    arr.forEach(function(v) {
                        if(v.idProduct){
                            objTotalByCategory[v.idProduct.maloaihang] = (objTotalByCategory[v.idProduct.gia] || 0)  + v.idProduct.gia * v.soluongdatmua;
                        }
                       
                    });
                }
                

                
                
                
                res.render('admin/home',{layout: 'admin',user,total,countToDay,newOrder,deliveryOrder,topProduct,productBuyByCategory,objCountByCategory,objTotalWeek,objTotalByCategory,message});
            }
        }
        
                
    }
    // [GET] Show Product
    async showProduct(req,res,next) {
        try{
            const message = req.flash('message');
            const user = req.user;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else{
                    const products = await Product.find({}).lean();
                    res.render('admin/product/show',{layout: 'admin',user,products,message});
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
                   
    }

     // [GET /admin/product-detail/:id] Show Product Detail
     async showDetailProduct(req,res,next) {
        try{
            const user = req.user;
            const id = req.params.id;
            const message = req.flash('message');
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else{
                    if(id){
                        const product = await Product.findById(id).lean();
                        res.render('admin/product/detail-product',{layout: 'admin',user,product,message});
                    }else{
                        res.redirect('back');
                    }
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
        

                
    }
    // [DELETE /admin/delete-product/:id] DELETE PRODUCT
    async deleteProduct(req,res,next) {
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await Product.deleteById(id);
                    }
                    res.redirect('back');
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
        
        
    }

     // GET [ADD /admin/add-product] ADDPRODUCT
     addProduct(req,res,next) {
        const user = req.user;
        
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else if(user.permistion != 'edit' && user.permistion != 'root'){
                req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                res.redirect("back");
            }else{
                res.render('admin/product/add-product',{layout: 'admin',user,message});
            }
        }
    
    }

      // GET [EDIT /admin/update-product/:id] UPDATE PRODUCT
      async updateProduct(req,res,next) {
        try{
                const user = req.user;
                const id = req.params.id;
                const message = req.flash('message');
                let product;
                if(!user){
                    res.redirect('/user/login');
                }else{
                    if(!user.isAdmin){
                        req.flash('message','Bạn không có quyền!');
                        res.redirect("/user/login");
                    }else{
                        if(id){
                            product = await Product.findById(id).lean();
                            
                        }
                        res.render('admin/product/edit-product',{layout: 'admin',user,message,product});
                    }
                }
            }catch(error){
                console.log(error);
                next(error);
            }
        
    
        }
     // POST [/admin/add-product] ADDPRODUCT
     async addProductToDb(req,res,next) {
        try{
            const user = req.user;
            const reqData = req.body;

            let newProduct;
            let system;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(reqData){
                            
                            let giagoc;
                            let gia = parseInt(reqData.giagoc);
                            let giam = parseInt(reqData.giam);
                            // neu khong co hoac khong la number
                            if(isNaN(giam)){
                                giam = 0
                            }
                            if(isNaN(gia)){
                                gia = 0
                            }
                            //
                            giagoc = gia; 
                            gia = gia - (giam * gia)/100;
                            giam = (giam / 100);         
                            
                            
                            // max with 5
                            // max with 5
                            let Slider = reqData.slider;
                            let arrSlider = [];
                            if(Slider){
                                if(!Array.isArray(Slider)){
                                    arrSlider.push(Slider);
                                   
                                }else{
                                    if(Slider.length > 5){
                                        Slider.length = 5;
                                    }
                                    arrSlider = Slider;
                                }
                            }
                            
                            
                            


                            system = {
                                manhinh: reqData.manhinh,
                                hedieuhanh: reqData.hedieuhanh,
                                cameratruoc: reqData.cameratruoc,
                                camerasau: reqData.camerasau,
                                chip: reqData.chip,
                                RAM: reqData.ram,
                                dungluong: reqData.dungluong,
                                sim: reqData.sim,
                                pin: reqData.pin,
                                sac: reqData.sac,
                                special: reqData.special
                            }
                            newProduct = {
                                cauhinh: system,
                                tensanpham: reqData.tensanpham,
                                maloaihang: reqData.maloaihang,
                                mota: reqData.mota,
                                hinhanh: reqData.hinhanh,
                                soluong: reqData.soluong,
                                giagoc: giagoc,
                                gia: gia,
                                giaqua: reqData.giaqua,
                                thoihanbaohanh: reqData.thoihanbaohanh,
                                phukien: reqData.phukien,
                                khuyenmai: reqData.khuyenmai,
                                giam: giam,
                                slider: arrSlider
                            }
                            var product = new Product(newProduct);
                            await product.save();
                            req.flash('message','Thêm sản phẩm thành công!');
                            res.redirect('back');
                    }else{
                        res.redirect('back');
                    }
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
        
    
    }

     // PUT [/admin/update-product/:id] Update PRODUCT
     async updateProductToDb(req,res,next) {
        try{
            
            const user = req.user;
            const reqData = req.body;
            const id = req.params.id;
            let newProduct;
            let system;
            

            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(reqData){
                            let gia = parseInt(reqData.giagoc);
                            let giam = parseInt(reqData.giam);
                            let giagoc;
                            // neu khong co hoac khong la number
                            if(isNaN(giam)){
                                giam = 0
                            }
                            if(isNaN(gia)){
                                gia = 0
                            }
                            // Tinh gia
                            giagoc = gia; 
                            gia = gia - (giam * gia)/100;
                            giam = (giam / 100);   
                            
                            // max with 5
                            let Slider = reqData.slider;
                            let arrSlider = [];
                            
                            if(Slider){
                                if(!Array.isArray(Slider)){
                                    arrSlider.push(Slider);
                                }else{
                                    if(Slider.length > 5){
                                        Slider.length = 5;
                                    }
                                    arrSlider = Slider;
                                    
                                }
                            }else{
                                arrSlider = reqData.sliderold.split(',');
                            }
                            
                            

                            system = {
                                manhinh: reqData.manhinh,
                                hedieuhanh: reqData.hedieuhanh,
                                cameratruoc: reqData.cameratruoc,
                                camerasau: reqData.camerasau,
                                chip: reqData.chip,
                                RAM: reqData.ram,
                                dungluong: reqData.dungluong,
                                sim: reqData.sim,
                                pin: reqData.pin,
                                sac: reqData.sac,
                                special: reqData.special
                            }
                            newProduct = {
                                cauhinh: system,
                                tensanpham: reqData.tensanpham,
                                maloaihang: reqData.maloaihang,
                                mota: reqData.mota,
                                hinhanh: reqData.hinhanh ? reqData.hinhanh : reqData.hinhanhold,
                                soluong: reqData.soluong,
                                giagoc: giagoc,
                                gia: gia ,
                                giaqua: reqData.giaqua,
                                thoihanbaohanh: reqData.thoihanbaohanh,
                                phukien: reqData.phukien,
                                khuyenmai: reqData.khuyenmai,
                                giam: giam,
                                slider: arrSlider

                            }
                            if(id){
                                
                                await Product.findByIdAndUpdate(id,newProduct);
                                req.flash('message','Cập nhật sản phẩm thành công!');
                                res.redirect('back');
                            }else{
                                res.redirect('back');
                            }
                            
                    }else{
                        res.redirect('back');
                    }
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
        
    
    }

    //  -------------------------- USER ---------------------------------//
    async getListUser(req,res,next) {
        try{
                // check admin?
            const user = req.user;
            const message = req.flash('message');
            const success = req.flash('success');
            let listUser;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else{
                        let query = {
                            $or: [
                                    {isAdmin: { $exists: false }},
                                    {isAdmin: { $ne: true }}
                                ]
                            };
                    
                        listUser = await User.find(query).lean();
                        let arrProductByUser = {};
                        let orders = await Order.find({delivered: true}).lean();
                        orders.forEach(function(v) {
                            arrProductByUser[v.email] = (arrProductByUser[v.email] || 0) + 1;
                        });
                        res.render('admin/user/list',{layout: 'admin',user,listUser,message,success,arrProductByUser});
                    }
            }     
        }catch(error){
            console.log(error);
            next(error);
        }
        
    }


    async lockUser(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await User.findByIdAndUpdate(id,{status: false});
                    }    
                    res.redirect('back');
                }
            }     
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    async unLockUser(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await User.findByIdAndUpdate(id,{status: true});
                    }    
                    res.redirect('back');
                }
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    async addCode(req,res,next) {
        try{
                
            const user = req.user;
            const message = req.flash('message');
            let {email,namecode,codeprice} = req.body;
            let objCode = {key: namecode, value: parseInt(codeprice)};
            console.log(objCode);
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                        let user = await User.findOneAndUpdate({email,isAdmin: {$in: [null, false]}},{$push: {code: objCode}});
                        if(user){
                            req.flash('success','Thêm mã giảm giá thành công!');
                            res.redirect('back');
                        }else{
                            req.flash('message','Không tìm thấy email khách hàng!');
                            res.redirect('back');
                        }
                        
                    }
            }     
        }catch(error){
            console.log(error);
            next(error);
        }
        
    }
     //  -------------------------- ORDER ---------------------------------//
     // GET /admin/list-order
     async getListOrder(req,res,next) {
        // check admin?
        const user = req.user;
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else{
                    let newOrder;
                    let confirmOrder;
                    let deliveredOrder;
                    let cancelOrder;

                    let queryNewOrder = {
                        status: { $eq: false }
                    };
                    let queryConfirmOrder = {
                        status: { $eq: true }
                    };

                    let queryDelivered = {
                    $and: [
                            {status: { $exists: false }},
                            {delivered: { $eq: true }}
                        ]
                    };
                    let queryCancelOrder = {
                        status: { $exists: false }
                    };

                    newOrder = await Order.find(queryNewOrder).lean();
                    confirmOrder = await Order.find(queryConfirmOrder).lean();
                    deliveredOrder = await Order.find(queryDelivered).lean();
                    cancelOrder = await Order.find(queryCancelOrder).lean();
                    
                    res.render('admin/order/list',{layout: 'admin',user,newOrder,confirmOrder,deliveredOrder,cancelOrder,message});
            }
        }     
    }

    // PATCH /admin/confirm-order
    async confirmOrder(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await Order.findByIdAndUpdate(id,{status: true,confirmedAt: Date.now()});
                    }
                    res.redirect('back');
                }
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    // PATCH /admin/cancel-order
    async cancelOrder(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        let objArrProductsBuy = await Order.findByIdAndUpdate(id,{ $unset: { status: true },cancelOrderAt: Date.now()},{new:true,select:{sanphammua: 1,_id: 0}});
                        
                        
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
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    // PATCH /admin/confirm-order-success
    async confirmOrderSuccess(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        let objArrProductsBuy = await Order.findByIdAndUpdate(id,{delivered: true,$unset: {status: true},deliveredAt: Date.now()},{new:true,select:{sanphammua: 1,_id: 0}});
                        let arrProductsBuy;
                        
                        if(objArrProductsBuy){
                            arrProductsBuy = objArrProductsBuy.sanphammua;
                        }
                        
                        if(arrProductsBuy && Array.isArray(arrProductsBuy)){
                            for(let obj of arrProductsBuy){
                                await Product.findByIdAndUpdate(obj.idProduct,{$inc:{soluongmua: obj.soluongdatmua}});
                                await Category.findOneAndUpdate(obj.maloaihang,{$inc: {soluongban: 1}});
                            }
                        }
                    }
                        res.redirect('back');
                }
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }
    // [GET /admin/list-order/list-product/:id]
    async getListProductInOrder(req,res,next) {
        // check admin?
        const user = req.user;
        const message = req.flash('message');
        const id = req.params.id;
        let productInOrders;
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else{
                if(id){
                    let dataOrders = await Order.findById(id).populate('sanphammua.idProduct').lean();
                    productInOrders =  dataOrders.sanphammua;
                }
                res.render('admin/order/list-product',{layout: 'admin',productInOrders});
            }
        }     
    }



    // ********************************* Categories ******************************** //
    // [GET] /admin/categories
    async getListCategories(req,res,next) {
    
        const user = req.user;
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else{
                let categories = await Category.find({}).lean();
                
                res.render('admin/categories/list',{layout: 'admin',user,categories,message});
            }
        }
        
    }
    // [POST] /admin/add-category
    async addCategory(req,res,next) {
        try{
            const data = req.body;
            const user = req.user;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'edit' && user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền chỉnh sửa để thực hiện!');
                    res.redirect("back");
                }else{
                    let categories = await Category.find({}).lean();
                    if(data){
                        let code = categories.map(function(obj){
                            return obj.maloaihang;
                        });
                        if(!code.includes(data.maloaihang)){
                            let category = new Category(data);
                            await category.save();
                            req.flash('message','Thêm thương hiệu thành công!');
                        }else{
                            req.flash('message','Không thể thêm do mã thương hiệu trùng lặp!');
                        }
                        
                        res.redirect('back');
                    }
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
                
    }

    // ******************* statistical *********************//
    async showStatistical(req,res,next) {
        try{
        const user = req.user;
        const message = req.flash('message');
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else{
                //get date current
                let now = new Date();
                let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                // get order today
                let ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: startOfToday}}).populate('sanphammua.idProduct').lean();
                
                // count order today
                let countOrderToday = ordersToday.length;
                // count product in order today
                let productBuyToday = 0;
                let productBuyCategoryToday = {};
                let revenueByCategoryToday = {};

                // get orders 10 day
                let orders10Day;

                for(let productBuy of ordersToday){
                    productBuy.sanphammua.forEach(function(obj){
                        if(obj.idProduct){
                            
                            productBuyToday += obj.soluongdatmua;
                            productBuyCategoryToday[obj.idProduct.maloaihang] =  ( productBuyCategoryToday[obj.idProduct.maloaihang] || 0) + obj.soluongdatmua;
                            revenueByCategoryToday[obj.idProduct.maloaihang] = ( revenueByCategoryToday[obj.idProduct.maloaihang] || 0) + (obj.soluongdatmua * obj.idProduct.gia);
                            
                        }
                       
                    });
                }
                console.log(productBuyCategoryToday);
                // category has max product buy
                let keyMaxProductByCategory,maxProductByCategory;
                if(productBuyCategoryToday && Object.keys(productBuyCategoryToday).length != 0){
                    keyMaxProductByCategory = Object.keys(productBuyCategoryToday).reduce((a, b) => productBuyCategoryToday[a] > productBuyCategoryToday[b] ? a : b);
                    maxProductByCategory = {'categoryMax': keyMaxProductByCategory, 'value': productBuyCategoryToday[keyMaxProductByCategory]};
                }
                
                // category has max revenue(doanh thu)
                let keyMaxRevenueByCategory,maxByRevenueCategory;
                if(revenueByCategoryToday && Object.keys(revenueByCategoryToday).length != 0){
                    keyMaxRevenueByCategory = Object.keys(revenueByCategoryToday).reduce((a, b) => revenueByCategoryToday[a] > revenueByCategoryToday[b] ? a : b);
            
                    maxByRevenueCategory = {'categoryMax': keyMaxRevenueByCategory, 'value': revenueByCategoryToday[keyMaxRevenueByCategory]};
                }
              
                //  revenue today
                let revenueToday;
                if(ordersToday && Array.isArray(ordersToday)){
                    revenueToday = ordersToday.reduce((total,obj) => total + obj.tongtien,0);
                }
                // profit today
                let profitToday;
                if(revenueToday){
                    profitToday  = Math.round((revenueToday * 13) / 100,0);
                }

                // 10 day
                 // Doanh thu 10 ngày qua
                 now = new Date();
                 now.setDate(now.getDate()-10);
                 orders10Day = await Order.find({deliveredAt: {$gt: now}}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                 
               
                res.render('admin/statistical/home',{layout: 'admin',user,message,countOrderToday,productBuyToday,maxProductByCategory,maxByRevenueCategory,revenueToday,profitToday,orders10Day});
            }
        }
        }catch(err){
            console.log(err);
            next(err);
        }
        
        
    }

    // ajax
    async statisticalByDate(req,res,next) {
    
        const user = req.user;
        const data = req.body;
        if(!user){
            res.redirect('/user/login');
        }else{
            if(!user.isAdmin){
                req.flash('message','Bạn không có quyền!');
                res.redirect("/user/login");
            }else if(!data){
                return;
            }else{
                 //get date current
                 let now = new Date();
                 let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                 let ordersToday;
                 let fromDate;
                 let toDate;
                if(data.selectDate){
                    let selectDate = data.selectDate;
                    switch(selectDate){
                        case 'today':
                            ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: startOfToday}}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                            fromDate = moment(now).format('l');
                            toDate = moment(now).format('l');
                            break;
                        case '7dayago':
                            now.setDate(now.getDate()-7);
                            ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: now}}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                            fromDate = moment(now).format('l');
                            toDate = moment(new Date()).format('l');
                            break;
                        case '30dayago':
                            now.setDate(now.getDate()-30);
                            ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: now}}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                            fromDate = moment(now).format('l');
                            toDate = moment(new Date()).format('l');
                            break;
                        case 'monthago':
                            let toMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            now.setMonth(now.getMonth()-1);
                            now.setDate(1);
                            console.log('monthago...');
                            console.log(toMonth);
                            console.log(now);
                            ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: now, $lt: toMonth }}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();

                            fromDate = moment(now).format('l');
                            toDate = moment(toMonth).format('l');
                            console.log(fromDate);
                            console.log(toDate);
                            break;
                        case 'month':
                            let fromMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                           
                            ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: fromMonth}}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                            fromDate = moment(fromMonth).format('l');
                            toDate = moment(new Date()).format('l');
                            break;

                        case 'year': 
                            let fromYear = new Date(now.getFullYear(),0,1);
                            ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: fromYear}}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                            fromDate = moment(fromYear).format('l');
                            
                            toDate = moment(new Date()).format('l');
                            break;

                }
                    
                    
                }else if(data.fromDate && data.toDate){
                    fromDate = new Date(data.fromDate);
                    toDate = new Date(data.toDate);
                    
                    // get order today
                    ordersToday = await Order.find({delivered: true,deliveredAt: {$gte: fromDate, $lt: toDate }}).sort({deliveredAt: 1}).populate('sanphammua.idProduct').lean();
                    
                    fromDate = moment(fromDate ).format('l');
                    toDate = moment(toDate ).format('l');
                }

                // TP chung
                let countOrderToday;
                let productBuyToday;
                let productBuyCategoryToday = {};
                let revenueByCategoryToday = {};
                // category has max product buy
                let keyMaxProductByCategory,maxProductByCategory;
                // category has max revenue(doanh thu)
                let keyMaxRevenueByCategory,maxByRevenueCategory;
                // 
                let revenueToday;
                let profitToday;


                

                // count order today
                
                if(ordersToday){
                    countOrderToday = ordersToday.length;
                    // count product in order today
                    productBuyToday = 0;
                    for(let productBuy of ordersToday){
                        productBuy.sanphammua.forEach(function(obj){
                            
                            if(obj.idProduct){
                                
                                productBuyToday += obj.soluongdatmua;
                                productBuyCategoryToday[obj.idProduct.maloaihang] =  ( productBuyCategoryToday[obj.idProduct.maloaihang] || 0) + obj.soluongdatmua;
                                revenueByCategoryToday[obj.idProduct.maloaihang] = ( revenueByCategoryToday[obj.idProduct.maloaihang] || 0) + (obj.soluongdatmua * obj.idProduct.gia);
                                
                            }
                        
                        });
                    }
                    
                    
                    if(productBuyCategoryToday && Object.keys(productBuyCategoryToday).length != 0){
                        keyMaxProductByCategory = Object.keys(productBuyCategoryToday).reduce((a, b) => productBuyCategoryToday[a] > productBuyCategoryToday[b] ? a : b);
                        maxProductByCategory = {'categoryMax': keyMaxProductByCategory, 'value': productBuyCategoryToday[keyMaxProductByCategory]};
                    }
                    
                   
                    if(revenueByCategoryToday && Object.keys(revenueByCategoryToday).length != 0){
                        keyMaxRevenueByCategory = Object.keys(revenueByCategoryToday).reduce((a, b) => revenueByCategoryToday[a] > revenueByCategoryToday[b] ? a : b);

                        maxByRevenueCategory = {'categoryMax': keyMaxRevenueByCategory, 'value': revenueByCategoryToday[keyMaxRevenueByCategory]};
                    }
                
                    
                    if(ordersToday && Array.isArray(ordersToday)){
                        revenueToday = ordersToday.reduce((total,obj) => total + obj.tongtien,0);
                    }
                    
                    if(revenueToday){
                        profitToday  = Math.round((revenueToday * 13) / 100,0);
                    }
                   
                   
                    
                   
                }
                res.send({ordersToday,countOrderToday,productBuyToday,maxProductByCategory,maxByRevenueCategory,revenueToday,profitToday,fromDate,toDate});
            }
        }
        
    }

    // ***************** account ****************** //
    
     // [GET] /admin/list-account Show Account
     async getListAccount(req,res,next) {
        try{
            const user = req.user;
            const message = req.flash('message');
            if(!user || !user.isAdmin){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else{
                    let listAccount = await User.find({isAdmin: true}).lean();
                   
                    res.render('admin/account/list',{layout: 'admin',user,message,listAccount});
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
                   
    }

    async lockAccount(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền');
                    res.redirect("/user/login");
                }else if(user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền root để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await User.findByIdAndUpdate(id,{status: false});
                    }    
                    res.redirect('back');
                }
            }     
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    async unLockAccount(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền root để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await User.findByIdAndUpdate(id,{status: true});
                    }    
                    res.redirect('back');
                }
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    // permistion
    async addPermistionEdit(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền');
                    res.redirect("/user/login");
                }else if(user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền root để thực hiện!');
                    res.redirect("back");
                }else{
                    if(id){
                        await User.findByIdAndUpdate(id,{permistion: 'edit'});
                    }    
                    res.redirect('back');
                }
            }     
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }

    async removePermistionEdit(req,res,next) {
        // check admin?
        try{
            const user = req.user;
            const id = req.params.id;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền root để thực hiện!!');
                    res.redirect("back");
                }else{
                    if(id){
                        await User.findByIdAndUpdate(id,{permistion: 'view'});
                    }    
                    res.redirect('back');
                }
            }    
        }catch(error){
            console.log(error);
            next(error);
        }
       
    }
    // add account
    async addAccount(req,res,next) {
        try{
            const message = req.flash('message');
            const user = req.user;
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền root để thực hiện!!');
                    res.redirect("back");
                }else{
                    res.render('admin/account/add-account',{layout: 'admin',user,message});
                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
                   
    }

    // add account
      // [POST] /admin/add-account add account to DB
      async addAccountToDB(req,res,next) {
        try{
            
            const user = req.user;
            const data = req.body;
            const SALT_ROUNDS = 10;
            const hashPassword = bcrypt.hashSync(data.password, SALT_ROUNDS);
            let newAccount = {
                ...data,
                password: hashPassword,
                isAdmin: true
            }
            if(!user){
                res.redirect('/user/login');
            }else{
                if(!user.isAdmin){
                    req.flash('message','Bạn không có quyền!');
                    res.redirect("/user/login");
                }else if(user.permistion != 'root'){
                    req.flash('message','Bạn không có quyền, cần quyền root để thực hiện!!');
                    res.redirect("back");
                }else{
                    let account = await User.findOne({email: data.email}).lean();
                    
                    if(account){
                        req.flash('message','Email đã tồn tại vui lòng nhập email khác!');
                        res.redirect("back");
                    }else{
                        newAccount = new User(newAccount);
                        await newAccount.save();
                        req.flash('message','Bạn vừa tạo tài khoản thành công!');
                        res.redirect("back");
                    }
                   
                    

                }
            }
        }catch(error){
            console.log(error);
            next(error);
        }
                   
    }
    
}

module.exports = new AdminController();
