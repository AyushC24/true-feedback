import  dbConnect  from '@/lib/dbConnect';
import {z} from 'zod';
import UserModel from '@/model/User';

export async function POST(request:Request){
    await dbConnect();

    try{

        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername});

        if(!user){
            console.log("User not found");
            return Response.json({
                success:false,
                message:"User not found",
        },{status:501})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)> new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account Verified successfully",
            },{status: 200});
        }

        if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification Code has expired!! Please signup again to get a new code",
        },{status:400});
        }

        return Response.json({
            success:false,
            message:"Incorrect Verification Code",
    },{status:400});
        


    }catch(error){
        console.error("Error verfying user",error);
        return Response.json({
            success:false,
            message:"Error verfying user",
    },{status:501});
    }
}
