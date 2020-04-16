const express=require('express')
const router=express.Router()
const { isAuthenticatedUser }=require('../middlewares/authMiddleware')

// importing user function userController
const { getUserProfile,updatePassword,updateUserDetails } = require('../controllers/userController')

router.route('/profile').get(isAuthenticatedUser,getUserProfile)
router.route('/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/profile/update').put(isAuthenticatedUser,updateUserDetails)

module.exports=router