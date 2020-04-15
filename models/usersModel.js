const mongoose= require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

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
            values:['customer','agent'],
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

// returning json web token
usersSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}
// compare user password with db password
usersSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

module.exports=mongoose.model('usersDB',usersSchema)