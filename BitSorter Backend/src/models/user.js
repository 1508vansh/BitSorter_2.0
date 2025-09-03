const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:16
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        immutable:true,
    },
    password:{
        type:String,
        default: null
    },
    avatarUrl:{
        type:String,
        default:null,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    problemSolved:[
        {
            type:Schema.Types.ObjectId,
            ref:'problem'
        }
    ]
},{timestamps:true})
const User = mongoose.model('user',UserSchema);
module.exports = User;