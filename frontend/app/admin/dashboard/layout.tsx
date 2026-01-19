import type React from "react"
import { Menu } from "lucide-react"

import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shadow-lg bg-white/80 backdrop-blur-sm border-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r w-72">
              <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex flex-col relative z-10 w-full">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
