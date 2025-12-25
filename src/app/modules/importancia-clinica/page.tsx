import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Module1Content from "@/components/modules/Module1Content"

export default async function Module1Page() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  })

  if (!user?.profile?.completedAt) {
    redirect("/onboarding")
  }

  // Buscar el módulo
  const module = await prisma.module.findUnique({
    where: { slug: "importancia-clinica" },
  })

  if (!module) {
    throw new Error("Módulo no encontrado")
  }

  // Buscar o crear progreso
  let progress = await prisma.userModuleProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: module.id,
      },
    },
  })

  if (!progress) {
    progress = await prisma.userModuleProgress.create({
      data: {
        userId: user.id,
        moduleId: module.id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    })
  }

  return <Module1Content moduleId={module.id} userId={user.id} />
}