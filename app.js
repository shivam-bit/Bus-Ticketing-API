const express=require('express')
const app=express()
const dotenv=require('dotenv')
const connectDatabase=require('./config/database')
const errorHandlerClass=require('./utils/errorHandlerClass')
const errorHandler=require('./middlewares/errorHandler')
const cookieParser=require('cookie-parser')
// setting up config.env file variables
dotenv.config ({path:"./config/config.env"})

// handling uncaught exception
process.on('uncaughtException',err=>{
    console.log(`Error : ${err.message}`)
    console.log('shutting down due to uncaught exception')
    process.exit(1);
})

// connecting to database
connectDatabase();
// setting up body parser
app.use(express.json())
// set cookie parser
app.use(cookieParser())

const tickets=require('./routes/ticket')
const auth=require('./routes/auth')
const user=require('./routes/user')
app.use('/api/v1',tickets)
app.use('/api/v1',auth)
app.use('/api/v1',user)
// handle unhandled routes
app.all('*',(req,res,next)=>{
    next(new errorHandlerClass(`${req.originalUrl} route not found`,404)) 
 })

app.use(errorHandler)
const PORT=process.env.PORT
const server = app.listen(PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// handling unhandled promise rejection
process.on('unhandledRejection',err=>{
    console.log(`Error : ${err.message}`)
    console.log('shutting down server due to unhandled promise rejection')
    server.close(()=>{
        process.exit(1);
    })
})
