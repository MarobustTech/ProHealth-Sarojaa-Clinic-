"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Shield } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl shadow-gray-900/5 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Sree Sarojaa Dental Clinic Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            Sree Sarojaa Dental Clinic
          </span>
        </Link>

        {/* Desktop Navigation */}
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
          {/* Admin link hidden for production/client view */}
          {/* <Button asChild size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 hidden md:inline-flex">
            <Link href="/admin/login">
              <Shield className="w-4 h-4 mr-1.5" />
              Admin
            </Link>
          </Button> */}
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
          >
            <Link href="/book">Book Appointment</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Site Navigation</SheetTitle>
              <div className="flex flex-col gap-6 mt-6">
                <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                  <div className="relative w-8 h-8">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold">Sree Sarojaa Dental Clinic</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link href="/" className="text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                  <Link href="/services" className="text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                    Services
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                    Contact
                  </Link>
                </nav>
                <div className="flex flex-col gap-3 mt-4">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400" onClick={() => setIsOpen(false)}>
                    <Link href="/book">Book Appointment</Link>
                  </Button>
                  {/* <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    <Link href="/admin/login">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Login
                    </Link>
                  </Button> */}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
