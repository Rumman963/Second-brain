import mongoose from "mongoose";
import {model , Schema} from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
mongoose.connect("mongodb+srv://Khan_274627:123@cluster0.hmbza7e.mongodb.net/second-brain");


const UserSchema = new Schema ({
   
    username:{type:String, unique:true , required: true},
    password:{type:String ,  required: true}


})

export const UserModel = model("users" , UserSchema);


const contentTypes = ['image', 'video', 'article', 'audio']; 
const contentSchema = new Schema ({
     
    title:{ type: String, required: true },
    link:{ type: String, required: true },
    type:{ type: String, enum: contentTypes, required: true },
    tags:[{type:ObjectId, ref:"tags"}],
    userId:{type:ObjectId , ref:'users', required:true}
   })


export const ContentModel = model("contents" , contentSchema);


const tagSchema = new Schema({

    title: { type: String, required: true, unique: true }


});


export const TagModel= model('tags', tagSchema);

const linkSchema = new Schema({

  hash: { type: String, required: true },
 userId: { type:ObjectId, ref: 'users', required: true },

});


