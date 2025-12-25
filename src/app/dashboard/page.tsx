import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DashboardHome from "@/components/dashboard/DashboardHome"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/")
  }

  // Chequear perfil DIRECTAMENTE en BD
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  })

  if (!user?.profile?.completedAt) {
    redirect("/onboarding")
  }

  // Obtener módulos y progreso
  const modules = await prisma.module.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: 'asc' },
  })

  const userProgress = await prisma.userModuleProgress.findMany({
    where: { userId: user.id },
  })

  console.log('📊 USER PROGRESS:', JSON.stringify(userProgress, null, 2))
  
  const completedModules = userProgress.filter(p => p.status === 'COMPLETED').length
  const totalModules = modules.filter(m => m.moduleType === 'EDUCATIONAL').length

  const stats = {
    completedModules,
    totalModules,
    progressPercentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    round1Complete: false,
    round2Complete: false,
    round2AvailableDate: null,
  }

  return (
    <DashboardHome
      user={{
        name: user.name || '',
        email: user.email,
        image: user.image,
      }}
      modules={modules}
      userProgress={userProgress}
      stats={stats}
    />
  )
}