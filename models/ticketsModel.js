const mongoose=require('mongoose')
const validatePhoneNumber = require('validate-phone-number-node-js')

const ticketsSchema=new mongoose.Schema({
    date_of_travel:{
        type:Date,
        required:[true,"please provide date"]
    },
    name:{
        type:String,
        trim:true,
        maxlength : [50, 'please use shorter name']
    },
    age:Number,
    gender:{
        type:String,
        enum : {
            values : [
                'male',
                'female'
            ],
            message : 'Please select from male or female'
        }
    },
    mobile:{
        type:String,
        validate:validatePhoneNumber.validate ,
        minlength : [10, 'mobile number should be at least 10 digits'],
        maxlength : [10, 'mobile number should be at max 10 digits']
    },
    validation_id_no:{
        type:String,
        required:[true,"validation id is must"]
    },
    status:{
        type:String,
        enum : {
            values : [
                'Booked',
                'Cancelled'
            ],
            message : 'ticket can be either booked or cancelled'
        }
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
})
ticketsSchema.pre('save',async function(next){
    this.status="Booked"
    next()
})

module.exports=mongoose.model('ticketsDB',ticketsSchema)