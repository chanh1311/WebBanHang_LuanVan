// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

// New Schema
const Order = new Schema({
    
    email: { type: String, maxLength: 50, required: true },
    hoten: { type: String, maxLength: 50, required: true },
    phone: { type: String, maxLength: 15, required: true },
    diachi: { type: String, maxLength: 150, required: true },
    tongtien: {type: Number, required: true},
    status: {type: Boolean, default: false},
    delivered:{type: Boolean},
    confirmedAt: {type: Date},
    deliveredAt: {type: Date},
    cancelOrderAt: {type: Date},
    method: {type: String},
    sanphammua: [
        {idProduct: {type: Schema.Types.ObjectId,required: true,ref: 'Product'}, soluongdatmua: {type: Number,required: true}}
    ]},
   
    { timestamps: true }   
);

// function define



module.exports = mongoose.model('Order', Order);
