import mongoose from "mongoose";
import {model , Schema} from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGO_URL as string);


const UserSchema = new Schema ({
   
    username:{type:String, unique:true , required: true},
    password:{type:String ,  required: true}


})

export const UserModel = model("users" , UserSchema);


const contentTypes = ['image', 'video', 'article', 'audio']; 
const contentSchema = new Schema ({
     
    title:{ type: String},
    link:{ type: String},
    type:{ type: String, enum: contentTypes },
    tags:[{type:mongoose.Types.ObjectId, ref:"tags"}],
    userId:{type:mongoose.Types.ObjectId , ref:'users', required:true}
   })


export const ContentModel = model("contents" , contentSchema);


const tagSchema = new Schema({

    title: { type: String, required: true, unique: true }


});


export const TagModel= model('tags', tagSchema);

const linkSchema = new Schema({

  hash: { type: String, required: true , unique: true},
 userId: { type:mongoose.Types.ObjectId, ref: 'users', required: true , unique:true},

});


export const LinkModel = model("link" , linkSchema )


