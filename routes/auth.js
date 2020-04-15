const express=require('express')
const router=express.Router()

// importing user controller
const { registerUser }=require('../controllers/authController')
router.route('/register').post(registerUser)

module.exports=router