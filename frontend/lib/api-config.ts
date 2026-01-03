/**
 * Get the API URL based on the current environment
 * If running on network IP (192.168.x.x), use network IP for backend
 * Otherwise use localhost
 */
export function getApiUrl(): string {
  // Check if NEXT_PUBLIC_API_URL is set
  if (typeof window !== "undefined") {
    // Client-side: check current hostname
    const hostname = window.location.hostname
    if (hostname.startsWith("192.168.") || hostname.startsWith("10.") || hostname.includes(".")) {
      // Running on network IP, use network IP for backend
      return process.env.NEXT_PUBLIC_API_URL || `http://${hostname}:8000`
    }
  }
  
  // Server-side or localhost: use env var or default to localhost
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
}


