const express=require('express')
const app=express()
const dotenv=require('dotenv')

// setting up config.env file variables
dotenv.config ({path:"./config/config.env"})

// setting up body parser
app.use(express.json())
const PORT=process.env.PORT
const server = app.listen(PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});