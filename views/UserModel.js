const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    matkhau:{
        type:String
    },
    hoten:{
        type:String,
       
    }
})
const UserModel = new mongoose.model('user',UserSchema);
module.exports = UserModel;