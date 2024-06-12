import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user :User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated",
    },{status:401});
    }

    const UserId = user._id;
    const {acceptMessages} = await request.json();

    try{

        const updatedUser = await UserModel.findByIdAndUpdate(UserId,{
            isAcceptingMessages: acceptMessages,
        },{new:true});
        
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to Update User status to accept Messages",
        },{status:401});
        }

        return Response.json({
            success:true,
            message:"Message Acceptance Status Updated Successfully",
            updatedUser,
    },{status:200});

    }catch(err){
        console.log("Failed to Update User status to accept Messages  ",err);
        return Response.json({
            success:false,
            message:"Failed to Update User status to accept Messages",
    },{status:501});
    }

}

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user :User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated",
    },{status:401});
    }

    const userId=user._id;
    try{
        const foundUser = await UserModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success:false,
                message:"Failed to Found User",
        },{status:404});
        }

        return Response.json({
            success:true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
    },{status:200});
    }catch(err){
        console.log("Error in getting Message Acceptance status  ",err);
        return Response.json({
            success:false,
            message:"Error in getting Message Acceptance status",
    },{status:501});
    }

}

