"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, User, ChevronDown } from "lucide-react"
import { getAdminUser, clearAdminAuth } from "@/lib/admin-auth"

export function AdminHeader() {
  const router = useRouter()
  const adminUser = getAdminUser()

  const handleLogout = () => {
    clearAdminAuth()
    router.push("/admin/login")
  }

  return (
    <header className="bg-gradient-to-r from-white via-blue-50/30 to-cyan-50/30 border-b border-gray-200 pl-16 md:px-6 py-4 flex items-center justify-between shadow-sm backdrop-blur-sm">
      <div className="flex-1">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
          Welcome back, {adminUser?.name || "Admin"}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white hover:shadow-md transition-all h-10 w-10 rounded-xl"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 hover:bg-white hover:shadow-md transition-all rounded-xl px-3 py-2 h-auto"
            >
              <Avatar className="h-9 w-9 ring-2 ring-blue-100 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white font-bold text-sm">
                  {adminUser?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900">{adminUser?.name || "Admin"}</span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-xl border-gray-200">
            <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 transition-colors">
              <User className="mr-2 h-4 w-4 text-blue-600" />
              <span className="font-medium">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
