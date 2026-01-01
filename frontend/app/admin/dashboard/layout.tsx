import type React from "react"

import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
