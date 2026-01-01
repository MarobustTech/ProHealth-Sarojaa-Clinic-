"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock, User, Phone, Mail, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentDetailsDialog } from "@/components/admin/appointment-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { getAdminToken } from "@/lib/admin-auth"
import { format } from "date-fns"

interface Appointment {
  id?: number
  _id?: string
  patientName: string
  patientEmail: string
  patientPhone: string
  doctorName?: string
  specialization: string
  appointmentDate: string
  appointmentTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  reason?: string
  createdAt?: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    let filtered = appointments

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredAppointments(filtered)
  }, [searchQuery, statusFilter, appointments])

  const fetchAppointments = async () => {
    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view appointments",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Don't clear token or redirect - just show empty state
          console.warn("401 Unauthorized - Token may be invalid, but staying on page")
          setAppointments([])
          setFilteredAppointments([])
          return
        }
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      // Ensure data is an array
      const appointmentsArray = Array.isArray(data) ? data : []
      setAppointments(appointmentsArray)
      setFilteredAppointments(appointmentsArray)
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch appointments",
        variant: "destructive",
      })
      // Set empty array on error
      setAppointments([])
      setFilteredAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId: string | number, newStatus: string) => {
    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update appointment status",
          variant: "destructive",
        })
        return
      }

      // Ensure appointmentId is a number
      const id = typeof appointmentId === 'string' ? parseInt(appointmentId, 10) : appointmentId
      if (isNaN(id)) {
        toast({
          title: "Error",
          description: "Invalid appointment ID",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Unable to update. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          // Don't clear token or redirect - user stays on page
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to update: ${response.status}`)
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || "Appointment status updated successfully",
      })
      await fetchAppointments()
    } catch (error: any) {
      console.error("Failed to update appointment status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment status",
        variant: "destructive",
      })
    }
  }

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments Management</h1>
          <p className="text-gray-500 mt-1">View and manage patient appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-4 py-2">
            Total: {Array.isArray(appointments) ? appointments.length : 0}
          </Badge>
          <Badge className="px-4 py-2 bg-yellow-100 text-yellow-700">
            Pending: {Array.isArray(appointments) ? appointments.filter((a) => a.status === "pending").length : 0}
          </Badge>
          <Badge className="px-4 py-2 bg-green-100 text-green-700">
            Confirmed: {Array.isArray(appointments) ? appointments.filter((a) => a.status === "confirmed").length : 0}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, doctor, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading appointments...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No appointments found</p>
          ) : (
            <div className="space-y-4">
              {Array.isArray(filteredAppointments) && filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id || appointment._id || `appt-${appointment.patientName}-${appointment.appointmentDate}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{appointment.patientPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{appointment.patientEmail}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                        <p className="text-xs text-gray-500">{appointment.specialization}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="font-medium text-gray-900">
                            {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>

                      <div>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment.id || appointment._id || "", value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="ghost" size="icon" onClick={() => handleView(appointment)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        appointment={selectedAppointment}
      />
    </div>
  )
}
