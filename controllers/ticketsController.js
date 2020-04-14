const ticketsDB=require('../models/ticketsModel')

// book ticket => api/v1/ticket/book
exports.bookTicket=async (req,res,next)=>{
    try{
        const dateObject=new Date(req.body.date_of_travel)
        if (dateObject!='Invalid Date'){
            const ticketsBooked=await ticketsDB.find({$and:[{date_of_travel:dateObject.toISOString()},{status:"Booked"}]})
            if (ticketsBooked.length>=8){
                res.status(200).json({
                    success:false,
                    message:"seats full"
                })
            }
            else{
                const booking=await ticketsDB.create(req.body)
                res.status(200).json({
                    success:true,
                    message:"Ticket Booked",
                    data:booking
            })}
        }else{
            res.status(200).json({
                success:false,
                message:"please provide date of travel"
            })
        }
    }catch(err){
        console.log(err.message)
        next(err)
    }
}
// cancel ticket => api/v1/ticket/cancel/:id
exports.cancelTicket=async(req,res,next)=>{
    try{
        const ticket=await ticketsDB.findByIdAndUpdate(req.params.id,{"status":"Cancelled"},{new:true})
        if (!ticket){
            res.status(200).json({
                success:false,
                message:"wrong id"
            })
        }
        res.status(200).json({
            success:true,
            message:"Ticket cancelled",
            data:ticket
        })
    }catch(err){
        next(err)
    }
}
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
        // runValidators: true 
    })
    res.status(200).json({
        success:true,
        message:"updated successfully",
        data:updatedTicket
    })
}
// view ticket status =>api/v1/ticket/status/:id
// @id is object_id
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
// view detailed ticket status =>api/v1/ticket/detail-status/:id
// @id is object_id
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
// => api/v1/ticket/all/:date/:status
// @date in the YYYY-MM-DD format
// @status either in Booked or Cancelled (first letter capital)
exports.allTickets=async (req,res,next)=>{
    const dateObject=new Date(req.params.date)
    const alltickets=await ticketsDB.find({$and:[{date_of_travel:dateObject.toISOString()},{status:req.params.status}]})
    if (alltickets.length===0){
        res.status(200).json({
            success:false,
            message:"no tickets found"
        })
    }
    res.status(200).json({
        success:true,
        message:`${alltickets.length} tickets found`,
        data:alltickets
    })
}
// 

