import type { AdminUser, AuthResponse } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Storage utilities
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("adminToken")
  return token ? token.trim() : null
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("adminUser")
  return user ? JSON.parse(user) : null
}

export function setAdminAuth(token: string, user: AdminUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem("adminToken", token)
  localStorage.setItem("adminUser", JSON.stringify(user))
}

export function clearAdminAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("adminToken")
  localStorage.removeItem("adminUser")
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken()
}

// API calls
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Registration failed")
  }

  // Store token and user data
  setAdminAuth(data.token, data.admin)
  return data
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Login failed")
  }

  // Store token and user data
  setAdminAuth(data.token, data.admin)
  return data
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    return response.ok
  } catch (error) {
    console.error("Backend health check failed:", error)
    return false
  }
}

export const adminAuth = {
  getToken: getAdminToken,
  getUser: getAdminUser,
  setAuth: setAdminAuth,
  clearAuth: clearAdminAuth,
  isAuthenticated: isAdminAuthenticated,
  register,
  login,
  checkBackendHealth,
}

export const getAuthToken = getAdminToken
