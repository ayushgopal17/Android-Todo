const dotenv=require("dotenv").config()

import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URL!);

const {Schema} = mongoose;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const TodoSchema= new mongoose.Schema({
    title: String,
    description: String,

  completed: {
    type: Boolean,
    default: false
  },
    dateTime: {
        type: Date,
        default: Date.now
    },
    deadline: Date,
    priority: {
        type: String,
        enum: ["low","medium","high"]
    },
    userId: mongoose.Types.ObjectId

})

export const userModel=mongoose.model("user",UserSchema);
export const todoModel=mongoose.model("todo",TodoSchema);
