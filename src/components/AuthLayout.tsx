import { useSession } from 'next-auth/react';
import { FC, ReactNode } from 'react'
import { redirect } from 'next/navigation'

interface AuthProps {
    children: ReactNode
}

const AuthLayout:FC<AuthProps> = ({ children }) => {
    const { data: session } = useSession();

    if(!session?.user) {
        return (<>{children}</>)
    } else {
        redirect("/")
    }
}

export default AuthLayout