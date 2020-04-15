const User=require('../models/usersModel')
const catchAsyncError=require('../middlewares/catchAsyncError')

// register a new user =>api/v1/register
exports.registerUser=catchAsyncError( async (req,res,next)=>{
    const { name,email,role,password } = req.body
    const user = await User.create({
        name,
        email,
        role,
        password
    })
    res.status(200).json({
        success:false,
        message:"user is registered",
        data:user
    })
})
