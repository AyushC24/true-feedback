import  dbConnect  from '@/lib/dbConnect';
import {z} from 'zod';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';


const UsernameQuerySchema = z.object({
    username:usernameValidation
})
export async function GET(request: Request){

    // if(request.method !=='GET'){
    //     return Response.json({
    //         success: false,
    //         message: "Only GET requests allowed",
    //     },{status: 405});
    // }
    
    await dbConnect();
    // localhost:3000/api/cuu?username=hitesh?phone=2323....
    try{

        const {searchParams}= new URL(request.url);
        const queryParam = {
            username:searchParams.get('username')
        }
        //validation with zod;
        const res = UsernameQuerySchema.safeParse(queryParam);
        console.log(res);
        if(!res.success){
            const usernameErrors= res.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length>0 ? usernameErrors.join(', '):'Invalid query parameters'
            },{status: 501});
        }
        const {username}=res.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username already exists",
            },{status: 501});
        }
        return Response.json({
            success: true,
            message: "Username is available",
        },{status: 200});

    }catch(error){
        console.error("Check username uniqueness",error);
        return Response.json({
            success:false,
            message:"Error checking username uniqueness",
    },{status:501});
    }
}