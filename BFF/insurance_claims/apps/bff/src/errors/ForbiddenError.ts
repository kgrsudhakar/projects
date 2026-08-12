import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError{

    constructor(message:string){

        super(403,message);

    }

}