const express=require('express')
const router=express.Router()
const { isAuthenticatedUser }=require('../middlewares/authMiddleware')
// importing user controller
const { registerUser,loginUser,logoutUser }=require('../controllers/authController')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(isAuthenticatedUser,logoutUser)

module.exports=router