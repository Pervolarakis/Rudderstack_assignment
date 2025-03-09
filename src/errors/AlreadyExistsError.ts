import {CustomErrorClass} from './CustomErrorClass';

export class AllreadyExistsError extends CustomErrorClass{    
    errorCode = 401;
    constructor(public property: string){
        super(`${property} already exists`);
        Object.setPrototypeOf(this, AllreadyExistsError.prototype)
    }
    getFormatedMessage(): string{
        return `${this.property} already exists`;
    }

}