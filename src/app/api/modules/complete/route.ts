import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { moduleId, userId, quizAnswers, quizScore } = await req.json()

    // Obtener progreso actual para calcular tiempo
    const currentProgress = await prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
    })

    if (!currentProgress || !currentProgress.startedAt) {
      return NextResponse.json(
        { error: "Progreso no encontrado" },
        { status: 404 }
      )
    }

    // Calcular tiempo en segundos
    const completedAt = new Date()
    const timeSpent = Math.floor(
      (completedAt.getTime() - currentProgress.startedAt.getTime()) / 1000
    )

    // Actualizar progreso
    const progress = await prisma.userModuleProgress.update({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      data: {
        status: 'COMPLETED',
        completedAt,
        timeSpent,
        quizAnswers: quizAnswers || null,
        quizScore: quizScore || null,
      },
    })

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error("Error completing module:", error)
    return NextResponse.json(
      { error: "Error al completar módulo" },
      { status: 500 }
    )
  }
}