const jwt=require('jsonwebtoken')
const User=require('../models/usersModel')
const catchAsyncErrors=require('../middlewares/catchAsyncError')
const errorHandlerClass=require('../utils/errorHandlerClass')

// check if user is authenticated or not
exports.isAuthenticatedUser=catchAsyncErrors(async (req,res,next)=>{
    let token
    if (req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new errorHandlerClass("login first to access this feature",401))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decoded.id)
    next()
})
// handling user roles
exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return next(new errorHandlerClass(`Role (${req.user.role}) is not allowed to access this resource`,403))
        }
        next()
    }
}