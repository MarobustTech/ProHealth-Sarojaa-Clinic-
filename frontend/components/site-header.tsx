import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, Shield } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl shadow-gray-900/5 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            ProHealth
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
          >
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/admin/login">
              <Shield className="w-4 h-4 mr-1.5" />
              Admin
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
          >
            <Link href="/book">Book Appointment</Link>
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
