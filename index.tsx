import express from "express";
const app= express();
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";


app.use(express.json());

import { userModel,todoModel } from "./models"



app.post("/signup",async (req,res)=>{
const username=req.body.username;
const password=req.body.password;

const userExist= await userModel.findOne({
username
})

if(userExist){

    return res.status(403).json({
        message: "User with this Username Already Exist"
    })

}

 const newUser = userModel.create({
    username,
    password
})

 return res.status(200).json({
message: "user created successfully"
})

})

app.post("/signin", async(req,res)=>{

    const username= req.body.username;
    const password= req.body.password;

    const userExist= await userModel.findOne({
        username,
        password
    })
    
    if(!userExist){
    return res.status(403).json({
        message: "User does not exist"
    })
    }
    const token= jwt.sign({userId: userExist.id},"todo_apptoken")

    res.json({
        token
    })

})


app.post("/todos",authMiddleware,async(req,res)=>{

const userId= req.userId;
const title=req.body.title;
const description=req.body.description;
const deadline=req.body.deadline;
const priority=req.body.priority;

const todo=await todoModel.create({
    title,
    description,
    deadline,
   priority,
   userId

})
 return res.json({
    message : "todo created successfully"
 })

})



app.get("/todos",  authMiddleware,async(req,res)=>{

    const userId=req.userId;
    const userTodos= await todoModel.find({
        userId
    })
    res.json({
        todos: userTodos
    })
})

app.delete("/todos/:id",authMiddleware,async(req,res)=>{

    const userId=req.userId;
    const todoId=req.params.id;

    await todoModel.deleteOne({
        _id: todoId,
        userId
    })
    res.json({
        message: "todo deleted successfully"
    })

})

app.listen(3000);