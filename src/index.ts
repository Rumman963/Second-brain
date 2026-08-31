import dotenv from "dotenv";
dotenv.config();
import express from "express"; 
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel , ContentModel , LinkModel } from "./db.js";
import { userMiddleware } from "./middleware.js";

import { JWT_PASSWORD } from "./config.js";
import { random } from "./util.js";
import cors from "cors";

const app= express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup",async (req,res) =>{

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
      
        title, 
         link,
         type,
         tags:[],
        userId:req.userId,

    })

  res.json({
    message:"Content added"
  })

})


app.get("/api/v1/content", userMiddleware ,async (req,res) =>{


 const userId = req.userId;
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
   
        userId:req.userId
     })
     res.json({
             message: result.deletedCount > 0 ? "Deleted successfully" : "No matching content found"
         });

})
app.post("/api/v1/brain/share",userMiddleware, async (req,res) =>{

      const share = req.body.share

      if(share){
        const existingLink = await LinkModel.findOne({
            userId:req.userId
        });

        if(existingLink){
        res.json({hash:existingLink.hash})
        return;
        }

        const hash=random(10)
        await LinkModel.create({
            userId:req.userId,
            hash:hash
        });
        res.json({hash:hash});
        return;
            
        }else{
        
            await LinkModel.deleteOne({userId:req.userId}) 
            res.json({message:"Disabled ShareLink"});
            return;
        }

})

app.get("/api/v1/brain/:shareLink", async(req,res) =>{
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    })
    

    if(!link){ 
        res.status(404).json({
            message:"ShareLink might be Invalid or disabled"
        })
        return;
    } 
     
        const content = await ContentModel.find({
             
            userId:link.userId
        })

        const user = await UserModel.findOne({
     
          _id:link.userId

        })

        if (!user){
            res.status(411).json({
                message:"user Not found"
            })
            return;
        }


        res.json({
            username:user.username,
            content:content

        })

})

app.listen(3000);






