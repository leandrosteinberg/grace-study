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
    async signIn({ user, account, profile }) {
      // Crear o actualizar usuario en la base de datos
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        // Crear nuevo usuario
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
        // Actualizar último login
        await prisma.user.update({
          where: { email: user.email! },
          data: { lastLogin: new Date() },
        })
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { profile: true },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.hasCompletedProfile = !!dbUser.profile?.completedAt
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "PARTICIPANT"
        session.user.hasCompletedProfile = token.hasCompletedProfile as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}