// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//
const Banner = new Schema({
    _id: { type: ObjectId },
    banner_top: { type: String, maxLength: 255, required: true },//1 banner header-top
    banner_bottom: { type: String, maxLength: 255, required: true },//1 banner ngang banner-one(Top Zone)
    banner_slider_right: { type: Array, required: true },// 4 banner
    banner_category: { type: Array, required: true },// 2 Banner thương hiệu
    
},{ timestamps: true },);

module.exports = mongoose.model('Banner', Banner);
