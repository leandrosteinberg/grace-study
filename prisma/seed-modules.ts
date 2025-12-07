import { prisma } from "@/lib/prisma"
import { ModuleType } from "@prisma/client"

async function seedModules() {
  console.log('🌱 Seeding modules...')

  const modules = [
    {
      orderIndex: 1,
      title: "Importancia Clínica",
      slug: "importancia-clinica",
      description: "Descubre por qué la limpieza mucosa es fundamental en endoscopía diagnóstica",
      estimatedDurationMinutes: 15,
      moduleType: ModuleType.EDUCATIONAL,
      isActive: true,
    },
    {
      orderIndex: 2,
      title: "Fundamentos de GRACE",
      slug: "fundamentos-grace",
      description: "Aprende la escala GRACE en detalle: historia, validación y definiciones exactas",
      estimatedDurationMinutes: 20,
      moduleType: ModuleType.EDUCATIONAL,
      isActive: true,
    },
    {
      orderIndex: 3,
      title: "Entrenamiento Práctico",
      slug: "entrenamiento-practico",
      description: "Practica con casos reales y recibe feedback inmediato",
      estimatedDurationMinutes: 25,
      moduleType: ModuleType.EDUCATIONAL,
      isActive: true,
    },
    {
      orderIndex: 4,
      title: "Aplicación Clínica",
      slug: "aplicacion-clinica",
      description: "Aprende a aplicar GRACE en tu práctica diaria",
      estimatedDurationMinutes: 15,
      moduleType: ModuleType.EDUCATIONAL,
      isActive: true,
    },
    {
      orderIndex: 5,
      title: "Evaluación Round 1",
      slug: "evaluacion-round-1",
      description: "Primera evaluación estandarizada de 38 casos clínicos",
      estimatedDurationMinutes: 30,
      moduleType: ModuleType.EVALUATION,
      isActive: true,
    },
    {
      orderIndex: 6,
      title: "Re-evaluación Round 2",
      slug: "evaluacion-round-2",
      description: "Segunda evaluación para medir concordancia intra-observador",
      estimatedDurationMinutes: 30,
      moduleType: ModuleType.EVALUATION,
      isActive: true,
    },
  ]

  for (const moduleData of modules) {
    await prisma.module.upsert({
      where: { slug: moduleData.slug },
      update: moduleData,
      create: moduleData,
    })
  }

  console.log('✅ Modules seeded successfully!')
}

seedModules()
  .catch((e) => {
    console.error('❌ Error seeding modules:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
