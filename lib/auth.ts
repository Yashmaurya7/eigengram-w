import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import GoogleProvider from "next-auth/providers/google"
export const authOptions:NextAuthOptions = {
adapter:PrismaAdapter(db),
secret:process.env.NEXTAUTH_SECRET,
session:{
    strategy:'jwt'
},
pages:{
signIn:'/sign-in'
},
providers: [
  GoogleProvider({
    clientId:process.env.GOOGLE_CLIENT_ID!,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET!
  }),
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "email", type: "text", placeholder: "jsmith@gmail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      // Add logic here to look up the user from the credentials supplied
    //   const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
    if(!credentials?.email||!credentials?.password){
        return null
    }
    const existingUser=await db.user.findUnique({
        where:{email:credentials?.email}
    });
    if(!existingUser){
        return null;
    }
    if(existingUser.password){
        const passwordMatch=await compare(credentials.password,existingUser?.password);
        if(!passwordMatch){
            return null
        }
    }
   
    return {
        id:existingUser.id,
        username:existingUser.username,
        email:existingUser.email,
       
    }
    }
  })
],
callbacks :{
    async jwt({token,user}){
        if(user){
            return {
                ...token,
                username:user.username
            }
        }
        return token
    },
    async session({session,token}){
        return {
            ...session,
            user:{
                ...session.user,
                username:token.username
            }
        }
       
    },
}
}
  