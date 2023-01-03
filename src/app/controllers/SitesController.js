const { toObjectMongoose } = require('../../util/mongoose');
const Product = require('../model/Product');
const Slider = require('../model/Slider');
const Banner = require('../model/Banner');
const Category = require('../model/Category');

class SitesController {
    // [GET] home
    // promise
    async index(req, res, next) {
        try{
            let user;
            if(req.user){
                user = req.user;
            }
            let category = await Category.find({}).lean();
            let slider = await Slider.find({}).lean();
            let banner = await Banner.findOne({}).lean();
            let productDate = await Product.find({}).sort({ createdAt: -1 }).limit(5).lean();
            let productSale = await Product.find({}).sort({ giam: -1 }).limit(15).lean(); 
            let productsBest = await Product.find({}).sort({ soluongmua: -1 }).limit(10).lean(); 
            

            res.render('home', {user,
                category,
                slider,
                banner,
                productDate,
                productSale,
                productsBest
            });
        }catch(error){
            console.log(error);
            next(error);
        }
        

        
    }

    
}

module.exports = new SitesController();
