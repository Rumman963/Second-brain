import express from "express"; 
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel , ContentModel } from "./db.js";
import { userMiddleware } from "./middleware.js";

import { JWT_PASSWORD } from "./config.js";

const app= express();
app.use(express.json());

app.post("/api/v1/signup",async (req,res) =>{

    //Zod validation , hash the password
    const username = req.body.username;
    const password= req.body.password;

 try{
    await UserModel.create({
        username:username,
        password:password
    })


    res.json({
        message:"User signed up"
    })

} catch(e){
    res.status(411).json({
        message:"User already exists"
    })
}

})

app.post("/api/v1/signin", async(req,res) =>{
   
    const username = req.body.username;
    const password= req.body.password;
    const ExistingUser=await UserModel.findOne({
        username,
        password
    })

    if(ExistingUser){
        const token = jwt.sign({
           id:ExistingUser._id
        },  JWT_PASSWORD)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message:"Incorrect Credential"
        })
    }
})

app.post("/api/v1/content",userMiddleware,async (req,res) =>{


    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
 
    await ContentModel.create({
       link,
       type,
       title,
       tags:[],
       //@ts-ignore
       userId: req.userId,

    })

  res.json({
    message:"Content added"
  })

})


app.get("/api/v1/content", userMiddleware ,async (req,res) =>{
  
 //@ts-ignore
 const userId = req.userId,
 const content = await ContentModel.find({
    userId:userId
 }).populate('userId', 'username');
   
 res.json({
    content
 })

})

app.delete("/api/v1/content", userMiddleware, async (req,res) =>{
  
    const contentId = req.body.contentId;
     const result= await ContentModel.deleteOne({
        _id:contentId,
        //@ts-ignore
        userId:req.userId
     })
     res.json({
             message: result.deletedCount > 0 ? "Deleted successfully" : "No matching content found"
         });

})
app.post("/api/v1/brain/share", (req,res) =>{


})

app.get("/api/v1/brain/:shareLink", (req,res) =>{


})

app.listen(3000);






