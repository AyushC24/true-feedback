import  UserModel  from '@/model/User';
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import dbConnect from '@/lib/dbConnect';

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email:{
                    label:"Email",
                    type:"text",
                },
                password:{
                    label:"Password",
                    type:"password",
                }
            },
            //credentials.identifier.email
            //credentials.password to get user password
            async authorize(credentials:any,req):Promise<any> {
                await dbConnect();
                try{
                    console.log("Credentials are: " ,credentials);
                     const user = await UserModel.findOne({
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier},
                            ]
                        });
                        // console.log(user);
                        // console.log("Email is ", credentials.identifier);
                        // console.log("Username is ", credentials.identifier.username);
                        if(!user) throw new Error("No user found with this email");
                        if(!user.isVerified) throw new Error("Please verify your account before login");
                        const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                        if(isPasswordCorrect){
                            return user;
                        }
                        else throw new Error("Incorrect password");
                }catch(err:any){
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessages;
                session.user.username=token.username;
            }
            return session
          },
        async jwt({ token, user }) {
            console.log("JWT ke Ander " ,user)
            if(user){
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username;
            }
            console.log("Token : ",token);
            return token
          },
          async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
              return `${baseUrl}/dashboard`;
            } else if (url.startsWith("/")) {
              return `${baseUrl}${url}`;
            }
            return baseUrl;
          },
    },
    pages:{
        signIn:'/sign-in',
    },
    session:{
        strategy:"jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
};