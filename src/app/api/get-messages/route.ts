import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import mongoose from "mongoose";

export async function GET(request:Request){

    await dbConnect()
    const session = await getServerSession(authOptions);
    const user :User = session?.user as User;
    // console.log("User in get messages: ", user);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated",
    },{status:401});
    }

    // const UserId = user._id; Here this id is string as inserted in auth in String type gives error in aggregation pipeline less normally it works

    const UserId= new mongoose.Types.ObjectId(user._id);

    try{

        const user_n =await UserModel.aggregate([
            {
                $match:{
                    _id:UserId,
                }
            },
            {
                $unwind:"$messages",
            },
            {
                $sort:{
                    "messages.createdAt":-1,
                }
            },
            {
                $group:{
                    _id:"$_id",
                    messages:{$push:"$messages"},
                }
            }
        ]);
        // console.log(user._id);
        // console.log(UserId);
        // console.log("Yo!! Get messages api ka user = ", user_n);
        if(!user_n) {
            return Response.json({
                success:false,
                message:"User not found",
        },{status:401});
        }
        if(user_n.length==0){
                return Response.json({
                    success:true,
                    // message:"No Messages found",
                },{status:200});
            }
        return Response.json({
            success:true,
            message: user_n[0].messages,
    },{status:200});

    }catch(err){
        console.log("Failed to get messages ", err);
        return Response.json({
            success:false,
            message:"Failed to get messages",
    },{status:401});
    }

}