const UsersDB=require('../models/usersModel')
const catchAsyncError=require('../middlewares/catchAsyncError')
const errorHandlerClass=require('../utils/errorHandlerClass')
const sendToken=require('../utils/jwtToken')

// current current user profile =>api/v1/profile
exports.getUserProfile=catchAsyncError(async(req,res,next)=>{
    const user=await UsersDB.findById(req.user.id)
        .populate({
            path:'ticketsHistory',
            select:'date_of_travel validation_id_no status'
        })
    res.status(200).json({
        success:true,
        data:user
    })
})
// update current user password => api/v1/password/update
exports.updatePassword=catchAsyncError(async(req,res,next)=>{
    const user = await UsersDB.findById(req.user.id).select('+password')
    // check previous user password
    const isMatched=await user.comparePassword(req.body.currentPassword)
    if (!isMatched){
        return next(new errorHandlerClass("password not matched",401))
    }
    user.password=req.body.newPassword
    await user.save()
    sendToken(user,200,res)
})

// update current user data =>api/v1/profile/update
exports.updateUserDetails=catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }
    const user=await UsersDB.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        data:user
    })
})
