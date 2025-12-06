import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || []

export const authOptions: NextAuthOptions = {
  // @ts-ignore
adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Verificar si es primer login
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        // Determinar si es miembro de GEDyT
        const isGedyt = user.email?.endsWith("@gedyt.com.ar") || false
        
        // Determinar rol (admin o participant)
        const role = adminEmails.includes(user.email!) ? "ADMIN" : "PARTICIPANT"

        // Actualizar usuario
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            isGedytMember: isGedyt,
            role: role,
          },
        })
      }

      return true
    },
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          include: { profile: true },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.hasCompletedProfile = !!dbUser.profile?.completedAt
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
}