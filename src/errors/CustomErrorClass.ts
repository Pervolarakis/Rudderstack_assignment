//abstract class for custom error creation

export abstract class CustomErrorClass extends Error{
    abstract errorCode: number;
    constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, CustomErrorClass.prototype)
    }
    abstract getFormatedMessage(): string
    
}