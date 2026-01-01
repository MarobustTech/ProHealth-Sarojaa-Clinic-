"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAdminToken } from "@/lib/admin-auth"
import { Loader2 } from "lucide-react"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Don't show guard on login/register pages
    if (pathname?.includes("/admin/login") || pathname?.includes("/admin/register")) {
      setIsChecking(false)
      setIsAuthenticated(false)
      return
    }

    const checkAuth = () => {
      try {
        const token = getAdminToken()
        // Check if token exists and is not demo token
        const authenticated = !!token && token !== "demo-token-12345" && token.trim() !== ""
        
        if (authenticated) {
          setIsAuthenticated(true)
          setIsChecking(false)
        } else {
          setIsAuthenticated(false)
          setIsChecking(false)
          // Only redirect if not already on login/register pages
          if (pathname && !pathname.includes("/admin/login") && !pathname.includes("/admin/register")) {
            router.replace("/admin/login")
          }
        }
      } catch (error) {
        // If there's an error checking auth, assume not authenticated
        setIsAuthenticated(false)
        setIsChecking(false)
        if (pathname && !pathname.includes("/admin/login") && !pathname.includes("/admin/register")) {
          router.replace("/admin/login")
        }
      }
    }

    // Check auth on mount and when pathname changes
    checkAuth()
  }, [pathname, router])

  // Don't show guard on login/register pages
  if (pathname?.includes("/admin/login") || pathname?.includes("/admin/register")) {
    return <>{children}</>
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
}
