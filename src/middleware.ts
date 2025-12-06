import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding")
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

    // Si está autenticado y NO tiene perfil completo
    if (isAuth && !token?.hasCompletedProfile) {
      // Si NO está en onboarding, redirigir ahí
      if (!isOnboardingPage) {
        return NextResponse.redirect(new URL("/onboarding", req.url))
      }
      // Si está en onboarding, dejarlo ahí
      return NextResponse.next()
    }

    // Si está autenticado y SÍ tiene perfil completo
    if (isAuth && token?.hasCompletedProfile) {
      // Si está en onboarding, redirigir a dashboard (ya completó)
      if (isOnboardingPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Proteger rutas de admin
    if (isAdminPage && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/onboarding"],
}