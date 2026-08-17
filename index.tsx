import express from "express";
const app= express();
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";


app.use(express.json());

import { userModel,todoModel } from "./models"



app.post("/signup",async (req,res)=>{
const name = req.body.name;
const email = req.body.email;
const password = req.body.password;

const userExist= await userModel.findOne({
email
})

if(userExist){

    return res.status(403).json({
        message: "User with this Username Already Exist"
    })

}

 const newUser = userModel.create({
    name,
    email,
    password
})

 return res.status(200).json({
message: "user created successfully"
})

})

app.post("/signin", async(req,res)=>{

    const email= req.body.email;
    const password= req.body.password;

    const userExist= await userModel.findOne({
        email,
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


app.patch("/todos/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.id;

  const updatedTodo = await todoModel.findOneAndUpdate(
    {
      _id: todoId,
      userId
    },
    {
      $set: req.body
    },
    {
      new: true
    }
  );

  res.json({
    todo: updatedTodo
  });
});

app.get("/todos", authMiddleware, async (req, res) => {
  const userId = req.userId;

  console.log("TODOS USER ID:", userId);

  const userTodos = await todoModel.find({
    userId
  });

  console.log("FOUND TODOS:", userTodos);

  res.json({
    todos: userTodos
  });
});

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

app.listen(process.env.PORT || 3000);