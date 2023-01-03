const { info } = require('node-sass');
const Product = require('../model/Product');

class CategoryController {
    // GET /category/:category
    showByCategory(req, res, next) {
        const category = req.params.category;
        const objSort = {banchaynhat: `{"soluongmua": -1}`,giatangdan: `{"gia": 1}`,giagiamdan: `{"gia": -1}`};
        const sortReq = req.query['_sort'];
        var sort = {soluongmua: -1};
        const user = req.user;
        if(sortReq == "banchaynhat" || sortReq == "giatangdan",sortReq == "giagiamdan"){
            sort = JSON.parse(objSort[sortReq]);
            
        }

        if (category === 'apple' || category === 'oppo' || category === 'xiaomi' || category === 'samsung' || category === 'huawai') {
            Product.find({maloaihang: category }).sort(sort)
                .lean()
                .then((product) => {
                    res.render('categories/show-category', { sortReq,product,category,user});
                })

                .catch(next);
        }else{
            res.render('categories/show-category',{user});
        }
    }
    // GET /category
    showByCategoryAll(req, res, next) {
        //
        const user = req.user;
        //
        var category,price,special,pin,screen,cam;
        var query_category = req.query['category'];
        var query_price = req.query['price'];
        var query_special = req.query['special'];
        var query_pin = req.query['pin'];
        var query_screen = req.query['screen'];
        var query_cam = req.query['cam'];
        //sort
        const objSort = {banchaynhat: `{"soluongmua": -1}`,giatangdan: `{"gia": 1}`,giagiamdan: `{"gia": -1}`};
        const sortReq = req.query['_sort'];
        // default
        var sort = {soluongmua: -1};
        
        //has sort
        if(sortReq == "banchaynhat" || sortReq == "giatangdan" || sortReq == "giagiamdan"){
            sort = JSON.parse(objSort[sortReq]);
        }

        //
        const categoryDefine = {apple: `{"maloaihang": "apple"}`,samsung: `{"maloaihang": "samsung"}`,xiaomi: `{"maloaihang": "xiaomi"}`,oppo: `{"maloaihang": "oppo"}`,huawai: `{"maloaihang": "huawai"}`};
        const priceDefine = {duoi2trieu: `{"gia" :{"$lt": 2000000}}`,tu2_4trieu: `{"gia" :{"$gte": 2000000, "$lt": 4000000}}`,tu4_7trieu: `{"gia":{"$gte": 4000000, "$lt": 7000000}}`,tu7_13trieu: `{"gia":{"$gte": 7000000, "$lt": 13000000}}`,tren13trieu:`{"gia":{"$gte": 13000000}}`};
        const specialDefine = {vantay: `{"cauhinh.special": {"$regex": "van tay", "$options": "i" }}`,nhandang_khuonmat: `{"cauhinh.special": {"$regex": "nhan dang", "$options": "i" }}`,sac_nhanh: `{"cauhinh.special": {"$regex": "sac nhanh", "$options": "i" }}`,chong_nuocbui: `{"cauhinh.special": {"$regex": "chong nuoc", "$options": "i" }}`};
        const camDefine = {quayphim_slow: `{"cauhinh.camerasau": {"$regex": "quay phim slow", "$options": "i" }}`,ai_cam: `{"cauhinh.camerasau": {"$regex": "ai cam", "$options": "i" }}`,chup3d: `{"cauhinh.camerasau": {"$regex": "chup 3d", "$options": "i" }}`,hieuung_dep: `{"cauhinh.camerasau": {"$regex": "hieu ung dep", "$options": "i" }}`,zoom: `{"cauhinh.camerasau": {"$regex": "zoom", "$options": "i" }}`};
        const pinDefine = {duoi_3000: `{"cauhinh.pin" :{"$lt": 3000}}`,tu3000_4000: `{"cauhinh.pin" :{"$gte": 3000, "$lt": 4000}}`,tren4000: `{"cauhinh.pin":{"$gte": 4000}}`};
        const screenDefine = {tranvien: `{"cauhinh.manhinh": {"$regex": "tran vien", "$options": "i" }}`,taitho: `{"cauhinh.manhinh": {"$regex": "tai tho", "$options": "i" }}`,inch6: `{"cauhinh.manhinh": {"$regex": "6", "$options": "i" }}`,ips:`{"cauhinh.manhinh": {"$regex": "IPS", "$options": "i" }}`,oled:`{"cauhinh.manhinh": {"$regex": "OLED", "$options": "i" }}`,manhinh_gap:`{"cauhinh.manhinh": {"$regex": "man hinh gap", "$options": "i" }}`};
        

        var categoryArrQuery = [{"maloaihang": { $ne: null}}];
        var priceArrQuery = [{"gia": { $ne: null}}];
        var specialArrQuery = [{"cauhinh.special": { $ne: null}}];
        var pinArrQuery = [{"cauhinh.pin": { $ne: null}}];
        var screenArrQuery = [{"cauhinh.screen": { $ne: null}}];
        var camArrQuery = [{"cauhinh.cam": { $ne: null}}];
        //
        if(typeof query_category != 'undefined'){
            category = query_category.split(',');
            categoryArrQuery = category.map(function(key){
                //
                return JSON.parse(categoryDefine[key]);
            })
           
        }
            
        if(typeof query_price != 'undefined'){
            price = query_price.split(',');
            priceArrQuery = price.map(function(key){
                //
                return JSON.parse(priceDefine[key]);
            })
            
        }

        if(typeof query_special != 'undefined'){
            special = query_special.split(',');
            specialArrQuery = special.map(function(key){
                //
                return JSON.parse(specialDefine[key]);
            })
           
        }
          
        if(typeof query_pin != 'undefined'){
            pin = query_pin.split(',');
            pinArrQuery = pin.map(function(key){
                
                return JSON.parse(pinDefine[key]);
            })
        }
            
        if(typeof query_screen != 'undefined'){
            screen = query_screen.split(',');
            screenArrQuery = screen.map(function(key){
                
                return JSON.parse(screenDefine[key]);
            })
        }
            
        if(typeof query_cam != 'undefined'){
            cam = query_cam.split(',');
            camArrQuery = cam.map(function(key){
                
                return JSON.parse(camDefine[key]);
            })
            
        }
            

    
        Product.find({$and: [{$or: categoryArrQuery},{$or: priceArrQuery},{$or: specialArrQuery},{$or: pinArrQuery},{$or: screenArrQuery},{$or: camArrQuery}]}).sort(sort)
            .lean()
            .then((product) => {
                res.render('categories/show-category', { sortReq,product,category,price,special,pin,screen,cam,user});
            })

            .catch(next);
    } 
}


module.exports = new CategoryController();
