const ticketsDB=require('../models/ticketsModel')

// book ticket => api/v1/ticket/book
exports.bookTicket=async (req,res,next)=>{
    const booking=await ticketsDB.create(req.body)
    ticket=await ticketsDB.findByIdAndUpdate(booking._id,{"status":"Booked"},{new:true})
    res.status(200).json({
        success:true,
        message:"Ticket Booked",
        data:ticket
    })
}

// cancel ticket by updating ticket-status to cancelled
// update details api/v1/ticket/update/:id
exports.updateTicket=async(req,res,next)=>{
    const ticket=await ticketsDB.findById(req.params.id)
    if (!ticket){
        res.status(404),json({
            success:false,
            message:"wrong id"
        })
    }
    const updatedTicket=await ticketsDB.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    })
    res.status(200).json({
        success:true,
        message:"updated successfully",
        data:updatedTicket
    })
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
        data:ticket.status
    })


}
// view detailed ticket status
exports.detailedTicketStatus=async (req,res,next)=>{
    const ticket=await ticketsDB.findById(req.params.id)
    if (!ticket){
        res.status(404),json({
            success:false,
            message:"wrong id"
        })
    }
    res.status(200).json({
        success:true,
        data:ticket
    })

}
// view all tickets where status is booked/cancelled
exports.allTickets=(req,res,next)=>{

}
// 