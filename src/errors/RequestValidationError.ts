import { ValidationError } from "express-validator";

export class RequestValidationError extends Error{
    errorCode = 400
    constructor(public errors: ValidationError[]){
        super(errors.toString());
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    getFormatedMessage(){
        const formattedErrors = this.errors.map(error=>{
            return {message: error.msg, field: error}
        })
        return formattedErrors;
    }
}