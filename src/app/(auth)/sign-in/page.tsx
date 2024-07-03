'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React, {  useEffect, useState } from 'react'
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { FormField,FormLabel,FormControl ,Form,FormItem,FormDescription,FormMessage} from "@/components/ui/form"
import { Input} from "@/components/ui/input"
// import { Button } from "@react-email/components"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const SignIn = () => {

  const [isSubmitting,setIsSubmitting] = useState(false);

  const { toast } = useToast() 
  const router = useRouter();
  
  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
  });

      //data form ka data h jo user ne fill kiya hoga
    const onSubmit = async(data: z.infer<typeof signInSchema>)=>
    {
      setIsSubmitting(true);
      // console.log("OHHH YEAHHHH!!!");
        // console.log(data);
        const res = await signIn("credentials",{
          redirectUrl:false,
          identifier:data.identifier,
          password:data.password,
        })
        console.log("Result for Login : ",res);
        if(res?.error){
          toast({
            title:"Login Failed!",
            description:"Incorrect Username or Password",
            variant:"destructive"
          })
          setIsSubmitting(false);
        }
        console.log("Response : ",res);
        if(res?.url){
          router.replace('/dashboard');
        }
        setIsSubmitting(false);
    }

  return (
      <div className="flex justify-center items-center min-h-screen Ibg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                    Join Mystery Message
            </h1>
            <p className="mb-4">Sign in to start your anonymous adventure</p>
          </div>

          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email or username"
                      {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password"
                      {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit"> 
                { isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                    </>
                  )  :   ('SignIn')
                }
              </Button>
              </form>

          </Form>
                <div className="text-center mt-4">
                  <p>
                    Not a member ?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                      Sign Up
                    </Link>
                  </p>
                </div>
        </div>
      </div>
  )
}

export default SignIn



  