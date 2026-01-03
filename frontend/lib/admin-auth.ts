export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("adminToken")
}

export function getAdminUser(): any {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("adminUser")
  return user ? JSON.parse(user) : null
}

export function clearAdminAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("adminToken")
  localStorage.removeItem("adminUser")
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken()
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }

  // Store token and user data
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", data.token)
    localStorage.setItem("adminUser", JSON.stringify(data.admin))
  }
}

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }

  // Store token and user data
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", data.token)
    localStorage.setItem("adminUser", JSON.stringify(data.admin))
  }
}

export const adminAuth = {
  getToken: getAdminToken,
  getUser: getAdminUser,
  clearAuth: clearAdminAuth,
  isAuthenticated: isAdminAuthenticated,
  register,
  login,
}

export const getAuthToken = getAdminToken
