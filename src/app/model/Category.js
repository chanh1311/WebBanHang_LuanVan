// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// New Schema
const Category = new Schema({
    
    maloaihang: { type: String, maxLength: 50, required: true, unique: true },
    tenloaihang: { type: String, maxLength: 50, required: true },
    soluongban: {type: Number}
});

module.exports = mongoose.model('Category', Category);
