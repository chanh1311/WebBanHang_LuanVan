// config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// New Schema
const User = new Schema({
    iduser: {type: String, maxLength: 50},
    fullname: { type: String, maxLength: 50, required: true },
    phone: { type: String, maxLength: 15},
    address: [
        {type: String}
    ],
    gender: { type: String, maxLength: 5},
    email: { type: String, maxLength: 50, required: true },
    password: { type: String, maxLength: 150},
    code:[
        {key: {type: String},value: {type: Number}}
    ],
    isAdmin: { type: Boolean},
    status: { type: Boolean, default: true},
    permistion: {type: String, maxLength: 10},
    isFacebook: { type: Boolean}
},{ timestamps: true});

// function define



module.exports = mongoose.model('User', User);
