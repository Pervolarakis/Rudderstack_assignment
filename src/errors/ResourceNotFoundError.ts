import {CustomErrorClass} from './CustomErrorClass';

export class ResourceNotFoundError extends CustomErrorClass{    
    errorCode = 401;
    constructor(public property: string){
        super(`Could not find ${property}`);
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype)
    }
    getFormatedMessage(): string{
        return `Could not find ${this.property}`;
    }

}