"use client";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod"

export default function register() {
    const router = useRouter();
    const { toast } = useToast();

    const userSchema = z.object({
        username: z.string().min(1, "Username is required").max(100),
        email: z.string().min(1, "Email is required").email('Invalid Email'),
        password: z.string().min(1, 'Password is required').min(8, "Password must have at least 8 characters"),
        confirmPassword: z.string().min(1, 'Password confirmation is required!')
    })

    const form = useForm<z.infer<(typeof userSchema)>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof userSchema>) => {

        const response = await fetch('/api/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
            })
        })

        if(response.ok) {
            router.push("/login")
        } else {
            console.error(response.body)
            toast({ title: "Error", description: "Failed to Register!"})
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
                        <h1 className="text-center text-3xl font-bold m-1">Create an account</h1>
                        <p className="opacity-50 text-sm">Enter your credentials below to create your account</p>
                    </div>
                    
                    
                    {/* Register */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[50%]">
                            {/* Username */}
                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem className="my-3">
                                    <FormControl>
                                        <Input placeholder="johndoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>
                            
                            
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
                            
                            
                            {/* Confirm Password */}
                            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                <FormItem className="my-3">
                                    <FormControl>
                                        <Input type="password" placeholder="Re-ender your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                            </FormField>

                            <Button className="w-full">Sign up with Email</Button>
                        </form>

                        <div className="pt-5">
                            Already have an existing account? <a className="underline text-blue-500" href="/login">Sign in</a>.
                        </div>
                    </Form>
                </div>
            </div>
        </AuthLayout>
    )   
}
