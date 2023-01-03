// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//
const Slider = new Schema({
    _id: { type: ObjectId },
    slidertrangchu: [
        {tieude: { type: String, maxLength: 255, required: true }},
        {hinhanh: { type: String, maxLength: 255, required: true }},
    ],
    slidertrangcategory: [
        {tieude: { type: String, maxLength: 255, required: true }},
        {hinhanh: { type: String, maxLength: 255, required: true }},
    ]
},{ timestamps: true});

module.exports = mongoose.model('Slider', Slider);
