const mongoose= require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const usersSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter name"]
    },
    email:{
        type:String,
        required:[true,"please enter email"],
        unique:true,
        validate:[validator.isEmail,"email id not valid"]
    },
    role:{
        type:String,
        enum:{
            values:['customer'],
            message:"please select user"
        },
        default:'customer'
    },
    password:{
        type:String,
        require:[true,"please enter password for your account"],
        minlength:[8,"your password should be at-least 8 characters long"],
        select:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

// encrypting password before saving
usersSchema.pre('save',async function(next){
    this.password=await bcrypt.hash(this.password,10)
})

module.exports=mongoose.model('usersDB',usersSchema)