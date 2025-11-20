import dbConnect from '@/lib/dbConnection'
import userModel from '@/model/user'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from "bcryptjs";

interface Credentials {
  email: string,
  password: string
}

interface AuthUser {
  id: string,
  email: string,
  name: string,
  notes: string[]
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials?: Credentials): Promise<AuthUser | null> {
        if (!credentials) {
          return null
        }
        await dbConnect()

        try {
          const user = await userModel.findOne({ email: credentials.email}).select("+password")

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          const { password, ...safeUser } = user.toObject();

          return safeUser as AuthUser;

        } catch (error) {
          console.error(error)
          throw new Error("Authentication failed")
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session
    }
  },
  pages: {
    signIn: "/signin"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}