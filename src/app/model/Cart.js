// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//
const Cart = new Schema({
    // co the thay doi cau truc
    idProduct: {type: Schema.Types.ObjectId, ref: 'Product'},
    soluongdatmua: {type: Number, required: true},
    emailkhachhang: {type: String,maxLength: 150, required: true}
},{timestamps: true});

module.exports = mongoose.model('Cart', Cart);
