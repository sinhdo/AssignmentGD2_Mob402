const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    masp: {
        type: String,
        require: true
    },
    tensp: {
        type: String,

    },
    anh: {
        type: String

    },
    dongia: {
        type: Number,
        default:0
    },
    mausac: {
        type: String
    },
    nguoiban:{
        type:String
    }
})
const ProductModel = new mongoose.model('product', ProductSchema);
module.exports = ProductModel;