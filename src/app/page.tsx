"use client";

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default async function page() {
    const { data: session } = useSession();

    if(session?.user) {
        return (
            <div className='h-screen flex items-center justify-center flex-col'>
                <div className='text-3xl font-semibold'>Welcome to admin {session?.user.username}!</div>
                <Button onClick={() => {signOut()}}>Sign Out</Button>
            </div>
        )
    } else {
        redirect("/register")
    }
}
