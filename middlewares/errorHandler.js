const errorHandlerClass=require('../utils/errorHandlerClass')
module.exports=(err,req,res,next)=>{
    if(process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success : false,
            error : err,
            errMessage : err.message,
            stack : err.stack
        });
    }
    else{
        // then it is in PRODUCTION mode
        // const message = Object.values(err.errors).map(value => value.message);
        if(err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new errorHandlerClass(message, 404);
            res.status(error.statusCode).json({
                success:false,
                message:error.message
            })
        }
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new errorHandlerClass(message, 400);
            res.status(error.statusCode).json({
                success:false,
                message:error.message
            })
        }
        if(err.name==='TypeError'){
            const message = "Wrong type of data is being passed"
            error = new errorHandlerClass(message, 401);
            res.status(error.statusCode).json({
                success:false,
                message:error.message
        })
        }
        // console.log(err)
        const message = err.message || "Internal Server Error"
        error = new errorHandlerClass(message, 500);
        res.status(error.statusCode).json({
            success:false,
            message:error.message
        })
    }
}