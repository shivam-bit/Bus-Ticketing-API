const express=require('express')
const router=express.Router()
const { isAuthenticatedUser }=require('../middlewares/authMiddleware')

// importing ticket controller
const { bookTicket,
    updateTicket,
    ticketStatus,
    detailedTicketStatus,
    allTickets,
    cancelTicket 
} = require('../controllers/ticketsController')
router.route('/ticket/book').post(isAuthenticatedUser,bookTicket)
router.route('/ticket/cancel/:id').put(isAuthenticatedUser,cancelTicket)
router.route('/ticket/update/:id').put(isAuthenticatedUser,updateTicket)
router.route('/ticket/status/:id').get(ticketStatus)
router.route('/ticket/detail-status/:id').get(detailedTicketStatus)
router.route('/ticket/all/:date/:status').get(allTickets)

module.exports=router