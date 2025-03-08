import {Request, Response, NextFunction} from 'express';
import { CustomErrorClass } from '../errors/CustomErrorClass';
import { RequestValidationError } from '../errors/RequestValidationError';

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomErrorClass){
        res.status(err.errorCode).json({success: false, error: err.getFormatedMessage()});
        return next();
    }
    if(err instanceof RequestValidationError){
        res.status(err.errorCode).json({success: false, error: err.getFormatedMessage()});
        return next();
    }
    else{
        res.status(400).json({success: false, error: 'An error occurred!'})
        return next();
    }
    
}