// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//
const Rate = new Schema({
    
    idsanpham: { type: String, maxLength: 50, required: true, ref: 'Product'},
    sosao: { type: Number, required: true },
    noidung: { type: String, maxLength: 255, required: true },
    email: { type: String, maxLength: 255, required: true},
    hoten: { type: String, maxLength: 255, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Rate', Rate);
