"use client";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod"

export default function Login() {
    const { toast } = useToast();
    const router = useRouter()
    const userSchema = z.object({
        email: z.string().min(1, "Email is required").email('Invalid Email'),
        password: z.string().min(1, 'Password is required').min(8, "Password must have at least 8 characters"),
    })

    const form = useForm<z.infer<(typeof userSchema)>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof userSchema>) => {
        const signInData = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        })

        console.log(signInData)

        if(signInData?.error) {
            toast({ title: "Error", description: "Failed to Login!"})
        } else {
            router.push("/")
        }
    };
  
    return (
        <AuthLayout>
            
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-[50%] bg-black h-screen">
                    <h1 className="text-xl font-semibold text-white ml-10 mt-10">NextAuth Example</h1>
                </div>
                <div className="w-[50%] flex items-center justify-center flex-col">
                    
                    
                    {/* Info */}
                    <div className="my-5">
                        <h1 className="text-center text-3xl font-bold m-1">Log in to your Account</h1>
                        <p className="opacity-50 text-sm">Enter your credentials below to sign in to account</p>
                    </div>
                    
                    
                    {/* Login */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[50%]">
                            {/* Email */}
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem className="my-3">
                                    <FormControl>
                                        <Input placeholder="test@mail.dev" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>

                            {/* Password */}
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem className="my-3">
                                    <FormControl>
                                        <Input type="password" placeholder="Enter a password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>

                            <Button className="w-full">Sign In</Button>
                        </form>
                        <div className="pt-5">
                            You need to create a account? <a className="underline text-blue-500" href="/register">Sign up</a>.
                        </div>
                    </Form>
                </div>
            </div>
        </AuthLayout>
    )   
}