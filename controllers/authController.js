const User=require('../models/usersModel')
const catchAsyncError=require('../middlewares/catchAsyncError')
const errorHandlerClass=require('../utils/errorHandlerClass')
const sendToken=require('../utils/jwtToken')

// register a new user =>api/v1/register
exports.registerUser=catchAsyncError( async (req,res,next)=>{
    const { name,email,role,password } = req.body
    const user = await User.create({
        name,
        email,
        role,
        password
    })
    sendToken(user,200,res)
})

// Login user =>api/v1/login
exports.loginUser=catchAsyncError(async(req,res,next)=>{
    const { email,password } =req.body
    // checks if email or password is entered by user
    if (!email || !password ){
        return next(new errorHandlerClass("please enter email or password",400))
    }
    // finding user in db
    const user=await User.findOne({email}).select('+password')
    if (!user){
        return next(new errorHandlerClass("invalid email or password",401))
    }
    // check password
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched){
        return next(new errorHandlerClass("invalid email or password",401))
    }
    sendToken(user,200,res)
})