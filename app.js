const express=require('express')
const app=express()
const dotenv=require('dotenv')
const rateLimit=require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean')
const hpp = require('hpp')
const cors=require('cors')
const bodyParser=require('body-parser')
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


// setup body parser
app.use(bodyParser.urlencoded({extended:true}))
// setup security header
app.use(helmet())
// setting up body parser
app.use(express.json())
// set cookie parser
app.use(cookieParser())
// sanitize data
app.use(mongoSanitize())
// prevent xss attack
app.use(xssClean())
// prevent parameter pollution
app.use(hpp())
// rate limit
const limiter=rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})

//  applying limiter to all requests
app.use(limiter);
// setting up cors so that resources can be used by other domains
app.use(cors())

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
