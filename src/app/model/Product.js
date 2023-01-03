

const mongoose = require('mongoose');

mongoose.set('debug', true);
const mongoose_delete = require('mongoose-delete');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// auto slug
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema(
    {
        // required
        tensanpham: { type: String, maxLength: 255, required: true },
        maloaihang: { type: String, maxLength: 30, required: true},
        mota: { type: String ,required: true },
        giagoc: { type: Number, required: true },
        gia: { type: Number, required: true },
        soluong: {type: Number, required: true},
        // no require
        hinhanh: { type: String, maxLength: 255},
        giaqua: { type: Number },
        giam: { type: Number },
        thoihanbaohanh: { type: Number },
        phukien: { type: String, maxLength: 255 },
        khuyenmai: { type: String },
        soluongmua: {type: Number},
        cauhinh: { 
            manhinh: {type: String},
            hedieuhanh: {type: String},
            cameratruoc: {type: String},
            camerasau: {type: String},
            chip: {type: String},
            RAM: {type: String},
            dungluong: {type: String},
            sim: {type: String},
            pin: {type: String},
            sac: {type: String},
            special: {type: String},
        },
        slug: { type: String, slug: 'tensanpham', unique: true },
        // createdAt: {type: Date,default: Date.now},
        // updatedAt: {type: Date},
        slider: [
            {type: String, maxLength: 255}
        ]
    },
    { timestamps: true },
    
);
// mongodb
// seach with
Product.index({tensanpham: "text",maloaihang: "text","cauhinh.special": "text","cauhinh.cam": "text","cauhinh.pin": "text","cauhinh.hedieuhanh": "text","cauhinh.RAM": "text","cauhinh.sac": "text","cauhinh.dungluong": "text"});



// add plugin
// Product.plugin(AutoIncrement);
mongoose.plugin(slug);
Product.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Product', Product);
