import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db";
import { compare } from "bcrypt";

export const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
            email: { label: "Email", type: "email", placeholder: "test@mail.dev" },
            password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials, req) {
            if (!credentials?.email || !credentials?.password)
                return null;

            const existingUser = await db.user.findUnique({where: { email: credentials.email }})
            if(!existingUser)
                return null;

            const passwordMatch = await compare(credentials.password, existingUser.password)
            if(!passwordMatch)
                return null;

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updateAt
            }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID + '',
            clientSecret: process.env.GITHUB_SECRET + ''
        })
    ],
    callbacks: {
        async jwt({ token, user }) {

            if(user)
                return {
                    ...token,
                    username: user.username
                }
            return token;
        },
        async session({session, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
            return session;
        }
    }
}