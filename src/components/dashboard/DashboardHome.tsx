"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { 
  BookOpen, 
  FlaskConical, 
  Award, 
  CheckCircle, 
  Lock, 
  PlayCircle,
  Clock,
  ChevronDown,
  LogOut,
  User
} from "lucide-react"

interface Module {
  id: string
  orderIndex: number
  title: string
  slug: string
  description: string | null
  estimatedDurationMinutes: number
  moduleType: string
}

interface UserProgress {
  moduleId: string
  status: string
  completedAt: Date | null
}

interface DashboardHomeProps {
  user: {
    name: string
    email: string
    image: string | null
  }
  modules: Module[]
  userProgress: UserProgress[]
  stats: {
    completedModules: number
    totalModules: number
    progressPercentage: number
    round1Complete: boolean
    round2Complete: boolean
    round2AvailableDate: Date | null
  }
}

export default function DashboardHome({ user, modules, userProgress, stats }: DashboardHomeProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const getModuleStatus = (moduleId: string) => {
    const progress = userProgress.find(p => p.moduleId === moduleId)
    return progress?.status || 'NOT_STARTED'
  }

  const isModuleLocked = (index: number) => {
    if (index === 0) return false
    const previousModule = modules[index - 1]
    return getModuleStatus(previousModule.id) !== 'COMPLETED'
  }

  const getDaysUntilRound2 = () => {
    if (!stats.round2AvailableDate) return null
    const now = new Date()
    const availableDate = new Date(stats.round2AvailableDate)
    const diffTime = availableDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="min-h-screen bg-gedyt-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Image 
                src="/logo-gedyt.png" 
                alt="GEDyT" 
                width={180} 
                height={60}
                className="h-12 w-auto"
              />
              <span className="text-gedyt-blue font-semibold text-lg border-l-2 border-gedyt-gray-medium pl-4">
                GRACE Platform
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:bg-gedyt-gray-light px-3 py-2 rounded-lg transition-colors"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gedyt-light-blue flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="font-medium text-gedyt-text">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gedyt-gray-light transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gedyt-text">Ver perfil</span>
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gedyt-blue to-gedyt-light-blue rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-blue-100 mb-6">
            Bienvenido a la Plataforma Educativa GRACE
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-blue-100 mt-2">
            Progreso general: {stats.progressPercentage}%
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Módulos Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gedyt-text">Módulos Educativos</h3>
                <p className="text-2xl font-bold text-gedyt-blue">
                  {stats.completedModules}/{stats.totalModules}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {stats.completedModules === stats.totalModules 
                ? '¡Todos los módulos completados!' 
                : `${stats.totalModules - stats.completedModules} módulos restantes`}
            </p>
            <Link
              href="#modulos"
              className="block text-center bg-gedyt-light-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-gedyt-blue transition-colors"
            >
              Continuar aprendiendo
            </Link>
          </div>

          {/* Round 1 Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${stats.round1Complete ? 'bg-green-100' : 'bg-orange-100'}`}>
                <FlaskConical className={`w-6 h-6 ${stats.round1Complete ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gedyt-text">Round 1</h3>
                <p className="text-2xl font-bold text-gedyt-blue">
                  {stats.round1Complete ? 'Completo' : 'Pendiente'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {stats.round1Complete 
                ? 'Evaluación completada exitosamente' 
                : 'Completa los módulos para desbloquear'}
            </p>
            <button
              disabled={!stats.round1Complete && stats.completedModules < stats.totalModules}
              className={`block w-full text-center font-semibold py-2 px-4 rounded-lg transition-colors ${
                stats.round1Complete
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : stats.completedModules === stats.totalModules
                  ? 'bg-gedyt-light-blue text-white hover:bg-gedyt-blue'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {stats.round1Complete ? 'Ver resultados' : 'Comenzar evaluación'}
            </button>
          </div>

          {/* Round 2 Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${stats.round2Complete ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Award className={`w-6 h-6 ${stats.round2Complete ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gedyt-text">Round 2</h3>
                <p className="text-2xl font-bold text-gedyt-blue">
                  {stats.round2Complete ? 'Completo' : getDaysUntilRound2() !== null ? `${getDaysUntilRound2()} días` : 'Bloqueado'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {stats.round2Complete 
                ? 'Certificado disponible' 
                : getDaysUntilRound2() !== null && getDaysUntilRound2()! <= 0
                ? 'Ya disponible para realizar'
                : 'Disponible después de Round 1'}
            </p>
            <button
              disabled={!stats.round2Complete && (getDaysUntilRound2() === null || getDaysUntilRound2()! > 0)}
              className={`block w-full text-center font-semibold py-2 px-4 rounded-lg transition-colors ${
                stats.round2Complete
                  ? 'bg-gradient-to-r from-gedyt-blue to-gedyt-light-blue text-white hover:opacity-90'
                  : getDaysUntilRound2() !== null && getDaysUntilRound2()! <= 0
                  ? 'bg-gedyt-light-blue text-white hover:bg-gedyt-blue'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {stats.round2Complete ? 'Descargar certificado' : 'Re-evaluación'}
            </button>
          </div>
        </div>

        {/* Módulos Educativos */}
        <div id="modulos" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gedyt-blue mb-6">
            Módulos Educativos
          </h2>

          <div className="space-y-4">
            {modules.map((module, index) => {
              const status = getModuleStatus(module.id)
              const isLocked = isModuleLocked(index)
              const isCompleted = status === 'COMPLETED'
              const isInProgress = status === 'IN_PROGRESS'

              return (
                <Link
                  key={module.id}
                  href={isLocked ? '#' : `/modules/${module.slug}`}
                  className={`block border-2 rounded-lg p-5 transition-all ${
                    isLocked
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : isCompleted
                      ? 'border-green-200 bg-green-50 hover:shadow-md'
                      : isInProgress
                      ? 'border-blue-200 bg-blue-50 hover:shadow-md'
                      : 'border-gray-200 hover:border-gedyt-light-blue hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${
                        isLocked
                          ? 'bg-gray-200'
                          : isCompleted
                          ? 'bg-green-200'
                          : isInProgress
                          ? 'bg-blue-200'
                          : 'bg-gedyt-light-blue/20'
                      }`}>
                        {isLocked ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : isInProgress ? (
                          <PlayCircle className="w-6 h-6 text-blue-600" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-gedyt-light-blue" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gedyt-text mb-1">
                          {module.orderIndex}. {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {module.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            {module.estimatedDurationMinutes} min
                          </span>
                          <span className={`font-medium ${
                            isCompleted
                              ? 'text-green-600'
                              : isInProgress
                              ? 'text-blue-600'
                              : isLocked
                              ? 'text-gray-500'
                              : 'text-gedyt-light-blue'
                          }`}>
                            {isLocked ? 'Bloqueado' : isCompleted ? 'Completado' : isInProgress ? 'En progreso' : 'Comenzar'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
