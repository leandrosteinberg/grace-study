import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Calcular valores derivados
    const egdPerWeekMap: { [key: string]: number } = {
      "menos-5": 2,
      "5-10": 7,
      "11-20": 15,
      "21-30": 25,
      "mas-30": 35,
    }

    const midpoint = egdPerWeekMap[data.egdPerWeek] || 0
    const estimatedAnnual = midpoint * 50

    // Calcular nivel de experiencia
    const currentYear = new Date().getFullYear()
    const yearsExperience = currentYear - parseInt(data.egdStartYear)
    
    let experienceLevel: "EXPERT" | "INTERMEDIATE" | "NON_EXPERT"
    if (yearsExperience >= 10 && estimatedAnnual >= 500) {
      experienceLevel = "EXPERT"
    } else if (yearsExperience < 2) {
      experienceLevel = "NON_EXPERT"
    } else {
      experienceLevel = "INTERMEDIATE"
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Crear o actualizar perfil
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        birthYear: parseInt(data.birthYear),
        country: data.country,
        city: data.city || null,
        gender: data.gender,
        institution: data.institution || null,
        institutionType: data.institutionType || null,
        hasAdvancedImaging: data.hasAdvancedImaging || false,
        medicalGraduationYear: parseInt(data.medicalGraduationYear),
        egdStartYear: parseInt(data.egdStartYear),
        egdPerWeek: data.egdPerWeek,
        egdPerWeekMidpoint: midpoint,
        estimatedEgdPerYear: estimatedAnnual,
        hasFellowship: data.hasFellowship,
        hasAdvancedTraining: data.hasAdvancedTraining,
        experienceLevel,
        knewGraceBefore: data.knewGraceBefore,
        usesOtherScales: data.usesOtherScales,
        usesSimethicone: data.usesSimethicone,
        completedAt: new Date(),
      },
      update: {
        birthYear: parseInt(data.birthYear),
        country: data.country,
        city: data.city || null,
        gender: data.gender,
        institution: data.institution || null,
        institutionType: data.institutionType || null,
        hasAdvancedImaging: data.hasAdvancedImaging || false,
        medicalGraduationYear: parseInt(data.medicalGraduationYear),
        egdStartYear: parseInt(data.egdStartYear),
        egdPerWeek: data.egdPerWeek,
        egdPerWeekMidpoint: midpoint,
        estimatedEgdPerYear: estimatedAnnual,
        hasFellowship: data.hasFellowship,
        hasAdvancedTraining: data.hasAdvancedTraining,
        experienceLevel,
        knewGraceBefore: data.knewGraceBefore,
        usesOtherScales: data.usesOtherScales,
        usesSimethicone: data.usesSimethicone,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}