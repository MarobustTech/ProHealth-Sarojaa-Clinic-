/**
 * Get the API base URL, auto-detecting network IP when running on network
 */
export function getApiBaseUrl(): string {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    
    // If on network IP (192.168.x.x, 10.x.x.x, or any IP address), use network IP for backend
    if (
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      (hostname.match(/^\d+\.\d+\.\d+\.\d+$/) && hostname !== "127.0.0.1")
    ) {
      return `http://${hostname}:8000`
    }
  }
  
  // Default to localhost or env var
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
}


