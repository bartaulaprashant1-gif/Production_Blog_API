import {validationResult} from "express-validator";

//types
import {Request, Response, NextFunction} from "express";

const validationError=(req:Request, res:Response, next:NextFunction)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({code:"ValidationError",errors: errors.mapped()});
    }
    next();
}
export default validationError