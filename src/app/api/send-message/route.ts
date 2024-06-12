import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();

    const {username,content} = await request.json();
    try{

        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                messages:"User not found"
            },{status:404});
        }

        //is User accepting messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                messages:"User is not accepting messages"
            },{status:403});
        }

        const newMessage = {content,createdAt:new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success:true,
            messages:"Message sent successfully"
        },{status:200});

    }catch(err){
        console.log("Error sending message " ,err);
        return Response.json({
            success:false,
            messages:"Error sending messages"
        },{status:501});
    }
}