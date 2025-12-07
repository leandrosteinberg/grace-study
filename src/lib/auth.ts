import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || []

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        const isGedyt = user.email?.endsWith("@gedyt.com.ar") || false
        const role = adminEmails.includes(user.email!) ? "ADMIN" : "PARTICIPANT"

        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            googleId: account?.providerAccountId,
            isGedytMember: isGedyt,
            role: role,
          },
        })
      } else {
        await prisma.user.update({
          where: { email: user.email! },
          data: { lastLogin: new Date() },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://"),
}