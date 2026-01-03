/**
 * Utility functions for API calls with authentication
 */

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      window.location.href = "/admin/login"
    }
  }

  return response
}

export function getApiUrl(path: string): string {
  // Auto-detect network IP if running on network
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  
  // If running in browser and on network IP, use network IP for backend
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    if (hostname.startsWith("192.168.") || hostname.startsWith("10.") || (hostname.includes(".") && hostname !== "localhost")) {
      baseUrl = `http://${hostname}:8000`
    }
  }
  
  return `${baseUrl}${path}`
}

