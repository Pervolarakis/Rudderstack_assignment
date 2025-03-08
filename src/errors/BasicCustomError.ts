import {CustomErrorClass} from './CustomErrorClass';
export class BasicCustomError extends CustomErrorClass{
    constructor(public message: string, public errorCode: number){
        
        super(message);
        Object.setPrototypeOf(this, BasicCustomError.prototype)
        
    }
    getFormatedMessage(): string{
        return this.message;
    }

}