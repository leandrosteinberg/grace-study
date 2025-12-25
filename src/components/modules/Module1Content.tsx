"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Activity, Stethoscope, CheckCircle2 } from "lucide-react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

interface Module1ContentProps {
  moduleId: string
  userId: string
}

export default function Module1Content({ moduleId, userId }: Module1ContentProps) {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  
  const totalSections = 5

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

const handleComplete = async () => {
  // Calcular puntaje
  const questions = [
    { id: 1, correct: 1 },
    { id: 2, correct: 1 },
    { id: 3, correct: 1 },
  ]
  
  const correctCount = questions.filter(
    q => quizAnswers[q.id] === q.correct
  ).length
  
  // Marcar módulo como completado con datos del quiz
  await fetch("/api/modules/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      moduleId, 
      userId,
      quizAnswers,
      quizScore: correctCount,
    }),
  })
  
  router.push("/dashboard")
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gedyt-blue hover:text-gedyt-light-blue transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Volver al inicio</span>
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                Sección {currentSection + 1} de {totalSections}
              </span>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gedyt-light-blue transition-all duration-500"
                  style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-12 min-h-[600px] flex flex-col">
          {/* Sección actual */}
          {currentSection === 0 && <Section1 />}
          {currentSection === 1 && <Section2 />}
          {currentSection === 2 && <Section3 />}
          {currentSection === 3 && <Section4 />}
          {currentSection === 4 && (
            <Section5 
              quizAnswers={quizAnswers} 
              setQuizAnswers={setQuizAnswers}
              onComplete={handleComplete}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gedyt-blue hover:bg-gedyt-blue hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {currentSection < totalSections - 1 && (
            <button
              onClick={nextSection}
              className="flex items-center gap-2 px-6 py-3 bg-gedyt-light-blue text-white rounded-lg font-medium hover:bg-gedyt-blue transition-all"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

// Por ahora dejamos las secciones vacías
function Section1() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-700">
      {/* Título */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-gedyt-blue tracking-tight">
          ¿Por qué GRACE?
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          El problema que todos enfrentamos
        </p>
      </div>

      {/* Stat impactante */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-3xl" />
        <div className="relative bg-white border-2 border-red-200 rounded-3xl p-16 shadow-2xl">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-orange-600 mb-6">
            10-20%
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-slate-800">
              de cánceres gástricos
            </p>
            <p className="text-xl text-slate-600">
              se pierden durante la endoscopía
            </p>
          </div>
        </div>
      </div>

      {/* Texto explicativo */}
      <div className="max-w-3xl space-y-6 text-left">
        <p className="text-lg text-slate-700 leading-relaxed">
          La visibilidad de la mucosa durante la endoscopía digestiva alta puede estar 
          comprometida por la presencia de <strong>espuma, burbujas, comida, fluido biliar y mucus</strong>.
        </p>
        
        <p className="text-lg text-slate-700 leading-relaxed">
          A pesar de las guías europeas que recomiendan ayuno de ≥6 horas para sólidos 
          y ≥2 horas para líquidos, <strong>esto no siempre es suficiente</strong>.
        </p>

        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Activity className="w-6 h-6 text-gedyt-light-blue flex-shrink-0 mt-1" />
          <p className="text-sm text-slate-600 italic">
            Fuentes: ESGE Guidelines & GRACE Validation Study
          </p>
        </div>
      </div>
    </div>
  )
}

function Section2() {
  return (
    <div className="flex-1 flex flex-col justify-center space-y-12 animate-in fade-in duration-700">
      {/* Título */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gedyt-blue">
          Ya lo hacemos en colonoscopía...
        </h2>
        <p className="text-xl text-slate-600">
          Ahora es el turno de la endoscopía alta
        </p>
      </div>

      {/* Cards comparativas */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Colonoscopía */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-emerald-900">
            Colonoscopía
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-emerald-900">Escala BBPS</p>
                <p className="text-sm text-emerald-700">Boston Bowel Preparation Scale</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-emerald-900">Validada internacionalmente</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-emerald-900">Uso rutinario global</p>
              </div>
            </div>
          </div>
        </div>

        {/* Endoscopía Alta */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-gedyt-light-blue rounded-2xl p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
            NUEVO
          </div>
          
          <div className="w-16 h-16 bg-gedyt-light-blue rounded-2xl flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gedyt-blue">
            Endoscopía Alta
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gedyt-light-blue flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gedyt-blue">Escala GRACE</p>
                <p className="text-sm text-slate-600">Gastroscopy RAte of Cleanliness Evaluation</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gedyt-light-blue flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gedyt-blue">Validada internacionalmente</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gedyt-light-blue flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gedyt-blue">El mismo estándar para EDA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusión */}
      <div className="bg-gedyt-blue/5 border border-gedyt-blue/20 rounded-xl p-6 text-center">
        <p className="text-lg text-slate-700">
          Ya tenemos escalas de limpieza validadas para colonoscopía. 
          <br />
          <strong className="text-gedyt-blue">Ahora, GRACE trae el mismo estándar para la endoscopía digestiva alta.</strong>
        </p>
      </div>
    </div>
  )
}

function Section3() {
  return (
    <div className="flex-1 flex flex-col justify-center space-y-12 animate-in fade-in duration-700">
      {/* Título */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gedyt-blue">
          ¿Qué es GRACE?
        </h2>
        <p className="text-xl text-slate-600">
          Una escala simple, validada y práctica
        </p>
      </div>

      {/* 3 Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1 - Significado */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 space-y-6 hover:border-gedyt-light-blue hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-gedyt-blue/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-gedyt-blue">G</span>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-800">
              GRACE significa:
            </h3>
            
            <div className="space-y-1 text-slate-600">
              <p><strong className="text-gedyt-blue">G</strong>astroscopy</p>
              <p><strong className="text-gedyt-blue">RA</strong>te of</p>
              <p><strong className="text-gedyt-blue">C</strong>leanliness</p>
              <p><strong className="text-gedyt-blue">E</strong>valuation</p>
            </div>
          </div>
        </div>

        {/* Card 2 - Segmentos */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 space-y-6 hover:border-gedyt-light-blue hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-cyan-600">3</span>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-800">
              Evalúa:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span className="text-slate-700">Esófago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span className="text-slate-700">Estómago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span className="text-slate-700">Duodeno</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Scores */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 space-y-6 hover:border-gedyt-light-blue hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">0-9</span>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-800">
              Scores:
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-semibold text-red-700">0</span>
                <span className="text-sm text-red-600">Peor</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="font-semibold text-orange-700">1-2</span>
                <span className="text-sm text-orange-600">Intermedio</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                <span className="font-semibold text-green-700">3</span>
                <span className="text-sm text-green-600">Mejor</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 text-center pt-2 border-t">
              Total: 0-9 puntos
            </p>
          </div>
        </div>
      </div>

      {/* Nota al pie */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
        <p className="text-slate-700">
          Cada segmento se evalúa de 0 (peor visibilidad) a 3 (mejor visibilidad)
        </p>
      </div>
    </div>
  )
}

function Section4() {
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  
  const countries = [
    { name: "Italia", coords: [12.5, 41.9] },
    { name: "Portugal", coords: [-8.2, 39.4] },
    { name: "Brasil", coords: [-47.9, -15.8] },
    { name: "Países Bajos", coords: [4.9, 52.4] },
    { name: "Bélgica", coords: [4.4, 50.8] },
    { name: "Alemania", coords: [10.4, 51.2] },
    { name: "Austria", coords: [16.4, 48.2] },
    { name: "Reino Unido", coords: [-1.9, 52.5] },
    { name: "Rep. Checa", coords: [14.4, 50.1] },
    { name: "Rusia", coords: [37.6, 55.8] },
    { name: "Francia", coords: [2.3, 48.9] },
    { name: "Noruega", coords: [10.8, 59.9] },
    { name: "Australia", coords: [144.9, -37.8] },
    { name: "Estados Unidos", coords: [-86.2, 39.8] },
    { name: "España", coords: [-3.7, 40.4] },
    { name: "Grecia", coords: [23.7, 38.0] },
    { name: "Rumania", coords: [26.1, 44.4] },
  ]

  return (
    <div className="flex-1 flex flex-col justify-center space-y-12 animate-in fade-in duration-700">
      {/* Título */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gedyt-blue">
          Validación Internacional
        </h2>
        <p className="text-xl text-slate-600">
          Un estudio multicéntrico global
        </p>
      </div>

      {/* Mapa con efecto glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Fondo con gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,168,232,0.3),transparent_50%)]"></div>
        
        {/* Contenido del mapa */}
        <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 p-8">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 170,
              center: [15, 45], // Centrado en Europa
            }}
            className="w-full h-[450px]"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(255, 255, 255, 0.15)"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { 
                        outline: "none", 
                        fill: "rgba(255, 255, 255, 0.25)",
                        transition: "all 0.3s"
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            
            {/* Marcadores con efecto de pulso */}
            {countries.map((country, idx) => (
              <g key={country.name}>
                {/* Círculo de pulso */}
                <Marker coordinates={country.coords as [number, number]}>
                  <circle 
                    r={12} 
                    fill="#00d9ff" 
                    opacity={0.3}
                    className="animate-ping"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  />
                </Marker>
                
                {/* Pin principal */}
                <Marker coordinates={country.coords as [number, number]}>
                  <circle 
                    r={5} 
                    fill="#00d9ff" 
                    stroke="#fff" 
                    strokeWidth={2}
                    className="drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]"
                  />
                  <title>{country.name}</title>
                </Marker>
              </g>
            ))}
          </ComposableMap>

          {/* Stats sobre el mapa */}
          <div className="mt-6 flex justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-black tracking-tight drop-shadow-lg">17</div>
              <div className="text-sm font-medium opacity-90">Países</div>
            </div>
            <div className="w-px bg-white/30"></div>
            <div className="text-center">
              <div className="text-4xl font-black tracking-tight drop-shadow-lg">5</div>
              <div className="text-sm font-medium opacity-90">Continentes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="group bg-white border-2 border-emerald-200 rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div className="text-4xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform">27</div>
          <div className="text-sm text-slate-600">Centros médicos</div>
        </div>
        
        <div className="group bg-white border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">54</div>
          <div className="text-sm text-slate-600">Endoscopistas</div>
        </div>
        
        <div className="group bg-white border-2 border-purple-200 rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">3</div>
          <div className="text-sm text-slate-600">Fases de validación</div>
        </div>
        
        <div className="group bg-white border-2 border-orange-200 rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div className="text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform">✓</div>
          <div className="text-sm text-slate-600">Expertos y no-expertos</div>
        </div>
      </div>

      {/* Texto resumen */}
      <div className="bg-gedyt-blue/5 border border-gedyt-blue/20 rounded-xl p-6">
        <p className="text-lg text-slate-700 leading-relaxed">
          GRACE fue validada en un estudio internacional con <strong>27 centros</strong> y <strong>54 endoscopistas</strong>, 
          incluyendo tanto expertos como no-expertos. Los resultados mostraron <strong>buena concordancia entre observadores</strong>, 
          demostrando que la escala es confiable independientemente del nivel de experiencia.
        </p>
      </div>
    </div>
  )
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
}

function Section5({ quizAnswers, setQuizAnswers, onComplete }: any) {
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "¿Qué porcentaje de cánceres gástricos pueden perderse durante una endoscopía?",
      options: ["5-10%", "10-20%", "20-30%"],
      correct: 1,
    },
    {
      id: 2,
      question: "¿Cuántos segmentos anatómicos evalúa GRACE?",
      options: ["2", "3", "5"],
      correct: 1,
    },
    {
      id: 3,
      question: "¿GRACE fue validada solo por expertos?",
      options: ["Verdadero", "Falso"],
      correct: 1,
    },
  ]

  const allAnswered = questions.every(q => quizAnswers[q.id] !== undefined)
  const allCorrect = questions.every(q => quizAnswers[q.id] === q.correct)

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })
  }

  return (
    <div className="flex-1 flex flex-col justify-center space-y-12 animate-in fade-in duration-700">
      {/* Título */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gedyt-blue">
          Verificá tu comprensión
        </h2>
        <p className="text-xl text-slate-600">
          3 preguntas rápidas sobre lo que aprendiste
        </p>
      </div>

      {/* Preguntas */}
      <div className="space-y-8">
        {questions.map((q) => {
          const answered = quizAnswers[q.id] !== undefined
          const isCorrect = quizAnswers[q.id] === q.correct

          return (
            <div key={q.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {q.id}. {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((option, idx) => {
                  const isSelected = quizAnswers[q.id] === idx
                  const showCorrect = answered && idx === q.correct
                  const showWrong = answered && isSelected && idx !== q.correct

                  return (
                    <button
                      key={idx}
                      onClick={() => !answered && handleAnswer(q.id, idx)}
                      disabled={answered}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all
                        ${!answered && 'hover:border-gedyt-light-blue hover:bg-blue-50 cursor-pointer'}
                        ${answered && 'cursor-not-allowed'}
                        ${showCorrect && 'border-green-500 bg-green-50'}
                        ${showWrong && 'border-red-500 bg-red-50'}
                        ${!answered && !isSelected && 'border-slate-200 bg-white'}
                        ${!answered && isSelected && 'border-gedyt-light-blue bg-blue-50'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`
                          ${showCorrect && 'text-green-700 font-semibold'}
                          ${showWrong && 'text-red-700'}
                          ${!answered && 'text-slate-700'}
                        `}>
                          {option}
                        </span>

                        {showCorrect && (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        )}
                        {showWrong && (
                          <span className="text-red-600 text-2xl">✕</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {answered && isCorrect && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">¡Correcto!</p>
                </div>
              )}

              {answered && !isCorrect && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-600 text-lg">ℹ️</span>
                  <p className="text-sm text-red-700">
                    La respuesta correcta es: <strong>{q.options[q.correct]}</strong>
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Botón completar */}
      {allAnswered && (
        <div className="pt-6 border-t border-slate-200">
          {allCorrect ? (
            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  ¡Excelente trabajo!
                </h3>
                <p className="text-green-700">
                  Respondiste todas las preguntas correctamente
                </p>
              </div>

              <button
                onClick={onComplete}
                className="w-full bg-gedyt-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-gedyt-light-blue transition-all shadow-lg hover:shadow-xl"
              >
                Completar módulo y volver al inicio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 text-center">
                <p className="text-orange-800">
                  Revisá las respuestas incorrectas. Podés continuar de todas formas.
                </p>
              </div>

              <button
                onClick={onComplete}
                className="w-full bg-slate-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all"
              >
                Completar módulo de todas formas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}