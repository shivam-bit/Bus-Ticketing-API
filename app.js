const express=require('express')
const app=express()
const dotenv=require('dotenv')
const connectDatabase=require('./config/database')
const errorHandler=require('./middlewares/errorHandler')
// setting up config.env file variables
dotenv.config ({path:"./config/config.env"})

// connecting to database
connectDatabase();
// setting up body parser
app.use(express.json())
const tickets=require('./routes/ticket')
app.use('/api/v1',tickets)
// app.use(tickets)
app.use(errorHandler)
const PORT=process.env.PORT
const server = app.listen(PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});