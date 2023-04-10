const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    matkhau:{
        type:String,
        require:true
    },
    hoten:{
        type:String
       
    },
    quyen:{
        type:String,
        default:"User"
    }
})
const UserModel = new mongoose.model('user',UserSchema);
module.exports = UserModel;