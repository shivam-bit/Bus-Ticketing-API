const ticketsDB=require('../models/ticketsModel')

// book ticket => api/v1/ticket/book
exports.bookTicket=async (req,res,next)=>{

}

// cancel ticket by updating ticket-status to cancelled
// update details api/v1/ticket/update/:id
exports.updateDetails=async(req,res,next)=>{

}
// view ticket status =>api/v1/ticket/status/:id
exports.ticketStatus=async(req,res,next)=>{
    const ticket=await ticketsDB.findById(req.params.id)
    if (!ticket){
        res.status(404),json({
            success:false,
            message:"wrong id"
        })
    }
    res.status(200).json({
        success:true,
        message:"updated successfully",
        data:ticket.status
    })


}
// view detailed ticket status
exports.detailedTicketStatus=(req,res,next)=>{

}
// view all tickets where status is booked/cancelled
exports.allTickets=(req,res,next)=>{

}
// 