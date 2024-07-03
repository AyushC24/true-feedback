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



const Page = () => {

  const [username,setUsername] = useState('');

  const [usernameMessage,setUsernameMessage] = useState('');

  const [isCheckingUsername,setIsCheckingUsername] = useState(false);

  const [isSubmitting,setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername,500); //isse har keyboard press ke baad backend per request nhi jayegi to check for unique username

  const { toast } = useToast() 
  const router = useRouter();
  
  //zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:"",
    }
  });

    useEffect(()=>{
        const checkUsernameUnique = async()=>{
          if(username){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try{
              const response = await axios.get(`/api/check-username-unique?username=${username}`);
            //   let message=response.data.message
              setUsernameMessage(response.data.message);

            }catch(error){
              const axiosError = error as AxiosError<ApiResponse>;
              setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
              
            }finally{
              setIsCheckingUsername(false);
            }
          }
        }
        checkUsernameUnique();
    },[username]);

      //data form ka data h jo user ne fill kiya hoga
    const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
      setIsSubmitting(true);
      try{
       const response = await axios.post<ApiResponse>('/api/sign-up',data);
        toast({
            title:'success',
            description: response.data.message
        });

        router.replace(`/verify/${username}`)
        setIsSubmitting(false);

      }catch(error){
        console.error("Error in Sign Up of User ", error);
        const axiosError = error as AxiosError<ApiResponse>;

        let errorMessage = axiosError.response?.data.message;
        toast({
          title:"Signup Failed",
          description: errorMessage,
          variant:"destructive"
        })
        setIsSubmitting(false);
      }
    }

  return (
      <div className="flex justify-center items-center min-h-screen Ibg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                    Join Mystery Message
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>

          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username"
                      {...field} 
                        onChange={(e)=>{
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                      
                    </FormControl>
                    {
                        isCheckingUsername && <Loader2 className="animate-spin"/>
                    }
                    <p className={`text-sm ${usernameMessage==="Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                        test {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email"
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
              <Button type="submit" disabled={isSubmitting}> 
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                    </>
                  )  :   ('Signup')
                }
              </Button>
              </form>

          </Form>
                <div className="text-center mt-4">
                  <p>
                    Already a member ?{' '}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                      Sign in 
                    </Link>
                  </p>
                </div>
        </div>
      </div>
  )
}

export default Page



  