const express=require('express')
const router=express.Router()

// importing ticket controller
const { bookTicket,updateTicket,ticketStatus,detailedTicketStatus } = require('../controllers/ticketsController')
router.route('/ticket/book').post(bookTicket)
router.route('/ticket/update/:id').put(updateTicket)
router.route('/ticket/status/:id').get(ticketStatus)
router.route('/ticket/detail-status/:id').get(detailedTicketStatus)

// router.get('/tickets',(req,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"route working in get"
//     })
// })


module.exports=router