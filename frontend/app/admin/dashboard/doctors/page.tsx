"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Edit, Trash2, Eye, AlertCircle } from "lucide-react"
import { DoctorFormDialog } from "@/components/admin/doctor-form-dialog"
import { DoctorViewDialog } from "@/components/admin/doctor-view-dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { getAdminToken } from "@/lib/admin-auth"
import { getApiBaseUrl } from "@/lib/get-api-url"

interface Doctor {
  id?: number
  _id?: string
  name: string
  email: string
  phone: string
  specialization: string
  experience: number
  qualification: string
  consultationFee: number
  opdTimings: string
  language: string[]
  bio: string
  profilePicture?: string
  isActive: boolean
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Always fetch doctors when component mounts
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors(doctors)
    }
  }, [searchQuery, doctors])

  const fetchDoctors = async () => {
    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view doctors",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Use the centralized API URL getter
      const baseUrl = getApiBaseUrl()
      const apiUrl = `${baseUrl}/api/doctors/all`
      console.log("Fetching doctors from:", apiUrl)
      console.log("Current hostname:", typeof window !== "undefined" ? window.location.hostname : "server-side")
      console.log("Token present:", !!token)

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((error) => {
        console.error("Fetch error details:", error)
        console.error("Attempted URL:", apiUrl)
        throw new Error(`Network error: ${error.message}. Make sure the backend is running on ${baseUrl}`)
      })

      console.log("Doctors API response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Doctors API error response:", errorText)
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminUser")
          }
          // Don't redirect here - let the auth guard handle it
          setDoctors([])
          setFilteredDoctors([])
          return
        }
        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Doctors API response data:", data)
      console.log("Response type:", typeof data, "Is array:", Array.isArray(data))
      const doctorsArray = Array.isArray(data) ? data : []
      console.log("Doctors array length:", doctorsArray.length)

      if (doctorsArray.length === 0) {
        console.warn("⚠️ No doctors returned from API!")
        console.warn("Full response:", JSON.stringify(data, null, 2))
      } else {
        console.log("✅ Successfully loaded", doctorsArray.length, "doctors")
        console.log("First doctor:", doctorsArray[0])
      }

      setDoctors(doctorsArray)
      setFilteredDoctors(doctorsArray)
    } catch (error: any) {
      console.error("Failed to fetch doctors:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch doctors. Please check your connection.",
        variant: "destructive",
      })
      setDoctors([])
      setFilteredDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (doctorId: string | number, currentStatus: boolean) => {
    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update doctor status",
          variant: "destructive",
        })
        return
      }

      // Ensure doctorId is a number (backend expects int)
      // Handle both id and _id formats
      let id: number
      if (typeof doctorId === 'string') {
        // Try to parse as number first
        id = parseInt(doctorId, 10)
        if (isNaN(id)) {
          // If it's not a number, it might be _id which is already a string representation
          // Try to extract number from it
          const numMatch = doctorId.match(/\d+/)
          if (numMatch) {
            id = parseInt(numMatch[0], 10)
          } else {
            toast({
              title: "Error",
              description: "Invalid doctor ID format",
              variant: "destructive",
            })
            return
          }
        }
      } else {
        id = doctorId
      }

      if (isNaN(id) || id <= 0) {
        console.error("Invalid doctor ID:", doctorId, "Parsed as:", id)
        toast({
          title: "Error",
          description: "Invalid doctor ID",
          variant: "destructive",
        })
        return
      }

      const apiUrl = `${getApiBaseUrl()}/api/doctors/${id}/toggle-active`
      console.log("Toggling doctor - ID:", id, "Type:", typeof id, "URL:", apiUrl)
      console.log("Token present:", !!token, "Token length:", token?.length)

      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Toggle response status:", response.status, response.statusText)

      if (!response.ok) {
        if (response.status === 401) {
          const errorText = await response.text().catch(() => "Unauthorized")
          console.warn("401 Unauthorized - Token may be invalid, but staying on page. Response:", errorText)
          // Don't clear token or redirect - user stays on page
          toast({
            title: "Authentication Error",
            description: "Unable to update. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          return
        }
        const errorData = await response.json().catch(() => ({}))
        console.error("Toggle failed:", errorData)
        throw new Error(errorData.detail || errorData.message || `Failed to update: ${response.status}`)
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || `Doctor ${!currentStatus ? "activated" : "deactivated"} successfully`,
      })
      await fetchDoctors()
    } catch (error: any) {
      console.error("Failed to toggle doctor:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update doctor status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (doctorId: string | number) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return

    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to delete doctor",
          variant: "destructive",
        })
        return
      }

      // Ensure doctorId is a number (backend expects int)
      const id = typeof doctorId === 'string' ? parseInt(doctorId, 10) : doctorId
      if (isNaN(id)) {
        toast({
          title: "Error",
          description: "Invalid doctor ID",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/doctors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Unable to delete. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          // Don't clear token or redirect - user stays on page
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to delete: ${response.status}`)
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || "Doctor deleted successfully",
      })
      await fetchDoctors()
    } catch (error: any) {
      console.error("Failed to delete doctor:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete doctor",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setDialogOpen(true)
  }

  const handleView = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setViewDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedDoctor(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors Management</h1>
          <p className="text-gray-500 mt-1">Manage your hospital's doctors and their profiles</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, specialization, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading doctors...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No doctors found</p>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id || doctor._id || `doctor-${doctor.email}`}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={doctor.profilePicture || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">{doctor.name}</h3>
                        <Badge variant={doctor.isActive ? "default" : "secondary"} className="shrink-0">
                          {doctor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{doctor.specialization}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                        <span>{doctor.experience} years exp</span>
                        <span>₹{doctor.consultationFee}</span>
                        <span className="hidden sm:inline">{doctor.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 md:hidden">Status:</span>
                      <Switch
                        checked={doctor.isActive}
                        onCheckedChange={() => {
                          const doctorId = doctor.id || doctor._id
                          if (!doctorId) {
                            toast({
                              title: "Error",
                              description: "Doctor ID is missing",
                              variant: "destructive",
                            })
                            return
                          }
                          handleToggleActive(doctorId, doctor.isActive)
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(doctor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doctor.id || doctor._id || "")}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DoctorFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doctor={selectedDoctor}
        onSuccess={fetchDoctors}
      />

      <DoctorViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} doctor={selectedDoctor} />
    </div>
  )
}
