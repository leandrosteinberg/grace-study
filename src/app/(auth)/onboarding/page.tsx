"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const isGedytMember = session?.user?.email?.endsWith("@gedyt.com.ar")

  const [formData, setFormData] = useState({
    // Demográficos
    birthYear: "",
    country: "Argentina",
    city: "",
    gender: "",
    
    // Institucional (auto para GEDyT)
    institution: isGedytMember ? "GEDyT" : "",
    institutionType: isGedytMember ? "PRIVATE" : "",
    hasAdvancedImaging: isGedytMember,
    
    // Profesional
    medicalGraduationYear: "",
    egdStartYear: "",
    egdPerWeek: "",
    
    // Formación
    hasFellowship: false,
    hasAdvancedTraining: false,
    
    // GRACE específico
    knewGraceBefore: false,
    usesOtherScales: [] as string[],
    usesSimethicone: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        alert("Error al guardar el perfil")
      }
    } catch (error) {
      alert("Error al guardar el perfil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gedyt-gray-light py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gedyt-blue mb-2">
              Completá tu perfil
            </h1>
            <p className="text-gray-600">
              Necesitamos algunos datos para personalizar tu experiencia
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className={`h-2 w-24 rounded ${step >= 1 ? 'bg-gedyt-light-blue' : 'bg-gray-200'}`} />
              <div className={`h-2 w-24 rounded ${step >= 2 ? 'bg-gedyt-light-blue' : 'bg-gray-200'}`} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* PASO 1: Perfil Profesional */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gedyt-blue mb-4">
                  Datos Profesionales
                </h2>

                {/* Año de nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de nacimiento *
                  </label>
                  <input
                    type="number"
                    required
                    min="1940"
                    max={new Date().getFullYear() - 20}
                    value={formData.birthYear}
                    onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gedyt-light-blue focus:border-transparent"
                    placeholder="Ej: 1985"
                  />
                </div>

                {/* País */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gedyt-light-blue focus:border-transparent"
                  >
                    <option value="Argentina">Argentina</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Chile">Chile</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Género */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gedyt-light-blue focus:border-transparent"
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                    <option value="PREFER_NOT_TO_SAY">Prefiero no decir</option>
                  </select>
                </div>

                {/* Año de graduación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de graduación médica *
                  </label>
                  <input
                    type="number"
                    required
                    min="1970"
                    max={new Date().getFullYear()}
                    value={formData.medicalGraduationYear}
                    onChange={(e) => setFormData({...formData, medicalGraduationYear: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gedyt-light-blue focus:border-transparent"
                    placeholder="Ej: 2010"
                  />
                </div>

                {/* Año que empezó EGD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿En qué año empezaste a realizar endoscopías digestivas altas? *
                  </label>
                  <input
                    type="number"
                    required
                    min="1970"
                    max={new Date().getFullYear()}
                    value={formData.egdStartYear}
                    onChange={(e) => setFormData({...formData, egdStartYear: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gedyt-light-blue focus:border-transparent"
                    placeholder="Ej: 2015"
                  />
                </div>

                {/* Volumen semanal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuántas EDA realizás por semana (promedio)? *
                  </label>
                  <select
                    required
                    value={formData.egdPerWeek}
                    onChange={(e) => setFormData({...formData, egdPerWeek: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gedyt-light-blue focus:border-transparent"
                  >
                    <option value="">Seleccioná una opción</option>
                    <option value="menos-5">Menos de 5 por semana (~250/año)</option>
                    <option value="5-10">5-10 por semana (~250-500/año)</option>
                    <option value="11-20">11-20 por semana (~500-1000/año)</option>
                    <option value="21-30">21-30 por semana (~1000-1500/año)</option>
                    <option value="mas-30">Más de 30 por semana (~1500+/año)</option>
                  </select>
                </div>

                {/* Fellowship */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fellowship"
                    checked={formData.hasFellowship}
                    onChange={(e) => setFormData({...formData, hasFellowship: e.target.checked})}
                    className="w-4 h-4 text-gedyt-light-blue border-gray-300 rounded focus:ring-gedyt-light-blue"
                  />
                  <label htmlFor="fellowship" className="ml-2 text-sm text-gray-700">
                    Tengo fellowship en gastroenterología
                  </label>
                </div>

                {/* Formación avanzada */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="advanced"
                    checked={formData.hasAdvancedTraining}
                    onChange={(e) => setFormData({...formData, hasAdvancedTraining: e.target.checked})}
                    className="w-4 h-4 text-gedyt-light-blue border-gray-300 rounded focus:ring-gedyt-light-blue"
                  />
                  <label htmlFor="advanced" className="ml-2 text-sm text-gray-700">
                    Tengo formación adicional en endoscopía avanzada
                  </label>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gedyt-light-blue text-white font-semibold rounded-lg hover:bg-gedyt-blue transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: GRACE Específico */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gedyt-blue mb-4">
                  Sobre la escala GRACE
                </h2>

                {/* Conocía GRACE */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="knewGrace"
                    checked={formData.knewGraceBefore}
                    onChange={(e) => setFormData({...formData, knewGraceBefore: e.target.checked})}
                    className="w-4 h-4 text-gedyt-light-blue border-gray-300 rounded focus:ring-gedyt-light-blue"
                  />
                  <label htmlFor="knewGrace" className="ml-2 text-sm text-gray-700">
                    Conocía la escala GRACE antes de este curso
                  </label>
                </div>

                {/* Otras escalas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Usás otras escalas de limpieza endoscópica? (podés marcar varias)
                  </label>
                  <div className="space-y-2">
                    {["PEACE", "Crema", "Barcelona", "Toronto"].map((scale) => (
                      <div key={scale} className="flex items-center">
                        <input
                          type="checkbox"
                          id={scale}
                          checked={formData.usesOtherScales.includes(scale)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, usesOtherScales: [...formData.usesOtherScales, scale]})
                            } else {
                              setFormData({...formData, usesOtherScales: formData.usesOtherScales.filter(s => s !== scale)})
                            }
                          }}
                          className="w-4 h-4 text-gedyt-light-blue border-gray-300 rounded focus:ring-gedyt-light-blue"
                        />
                        <label htmlFor={scale} className="ml-2 text-sm text-gray-700">
                          {scale}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simeticona */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="simethicone"
                    checked={formData.usesSimethicone}
                    onChange={(e) => setFormData({...formData, usesSimethicone: e.target.checked})}
                    className="w-4 h-4 text-gedyt-light-blue border-gray-300 rounded focus:ring-gedyt-light-blue"
                  />
                  <label htmlFor="simethicone" className="ml-2 text-sm text-gray-700">
                    Utilizo simeticona de rutina antes de las endoscopías
                  </label>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gedyt-blue text-white font-semibold rounded-lg hover:bg-gedyt-light-blue transition-colors disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Finalizar"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}