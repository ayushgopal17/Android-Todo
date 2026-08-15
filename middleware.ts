import jwt from "jsonwebtoken"
import { Request,Response,NextFunction } from "express";

 export function authMiddleware(req:Request,res:Response,next:NextFunction){

const token = req.headers.token as string;
const decode=jwt.verify(token,"todo_apptoken") as jwt.JwtPayload & {
    userId: string;
};

if(decode.userId){
    req.userId=decode.userId
     next();
}
else{
    res.json({
        message: "Invalid Token"
    })
}


}