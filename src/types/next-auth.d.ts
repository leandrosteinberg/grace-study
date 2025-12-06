import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "PARTICIPANT"
      hasCompletedProfile: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: "ADMIN" | "PARTICIPANT"
    isGedytMember: boolean
  }
}