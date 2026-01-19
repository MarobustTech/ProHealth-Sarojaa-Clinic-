"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, CalendarIcon, Filter, Grid, List, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import type { Appointment, Doctor, Patient } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<{
    date: string
    appointments: Appointment[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "male" as "male" | "female" | "other",
    doctorId: "",
    specialization: "",
    appointmentDate: "",
    appointmentTime: "",
  })
  const { toast } = useToast()

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
  })

  useEffect(() => {
    loadAppointments()
    loadDoctors()
    loadPatients()
  }, [])

  const loadDoctors = async () => {
    try {
      const data = await api.getDoctors()
      setDoctors(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
    }
  }

  const loadPatients = async () => {
    try {
      const data = await api.getPatients()
      setPatients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    }
  }

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await api.getAppointments()
      const appointmentsArray = Array.isArray(data) ? data : []
      setAppointments(appointmentsArray)
      calculateStats(appointmentsArray)
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch appointments",
        variant: "destructive",
      })
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async () => {
    try {
      // Validate required fields
      if (!newAppointment.patientName || !newAppointment.patientEmail || !newAppointment.patientPhone ||
        !newAppointment.appointmentDate || !newAppointment.appointmentTime || !newAppointment.doctorId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Create appointment using public booking API (it creates patient if needed)
      const appointmentData = {
        patientName: newAppointment.patientName,
        patientEmail: newAppointment.patientEmail,
        patientPhone: newAppointment.patientPhone,
        patientAge: parseInt(newAppointment.patientAge) || 0,
        patientGender: newAppointment.patientGender,
        doctorId: parseInt(newAppointment.doctorId),
        specialization: newAppointment.specialization,
        appointmentDate: newAppointment.appointmentDate,
        appointmentTime: newAppointment.appointmentTime,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to create appointment")
      }

      toast({
        title: "Success",
        description: "Appointment created successfully",
      })

      setIsAddDialogOpen(false)
      setNewAppointment({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        patientAge: "",
        patientGender: "male",
        doctorId: "",
        specialization: "",
        appointmentDate: "",
        appointmentTime: "",
      })
      await loadAppointments()
    } catch (error: any) {
      console.error("Failed to create appointment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create appointment",
        variant: "destructive",
      })
    }
  }

  const calculateStats = (data: Appointment[]) => {
    setStats({
      total: data.length,
      pending: data.filter((a) => a.status === "pending").length,
      confirmed: data.filter((a) => a.status === "confirmed").length,
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter((apt) => apt.appointmentDate === date)
  }

  const formatCalendarDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const filteredAppointments = appointments
    .filter((appointment) => {
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.doctorName && appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateCompare = new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      if (dateCompare !== 0) return dateCompare
      return b.appointmentTime.localeCompare(a.appointmentTime)
    })

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

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await api.updateAppointmentStatus(appointmentId, newStatus)
      toast({
        title: "Success",
        description: "Appointment status updated successfully",
      })
      await loadAppointments()
    } catch (error: any) {
      console.error("Failed to update appointment status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment status",
        variant: "destructive",
      })
    }
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const weeks = []
    let days = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-gray-100 bg-gray-50/30" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatCalendarDate(year, month, day)
      const dayAppointments = getAppointmentsForDate(dateString)
      const isToday = dateString === new Date().toISOString().split("T")[0]

      days.push(
        <div
          key={day}
          className={`group min-h-[100px] border border-gray-100 bg-white p-2 transition-all hover:bg-gray-50 ${isToday ? "border-l-4 border-l-cyan-500 bg-cyan-50/30" : ""
            }`}
        >
          <div
            className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${isToday
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm"
              : "text-gray-700 group-hover:bg-gray-100"
              }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map((apt) => (
              <div
                key={apt.id}
                className="cursor-pointer overflow-hidden rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-1 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                onClick={() => setSelectedDateAppointments({ date: dateString, appointments: dayAppointments })}
              >
                <div className="truncate">{apt.patientName}</div>
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <button
                className="w-full rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-all hover:bg-gray-200"
                onClick={() => setSelectedDateAppointments({ date: dateString, appointments: dayAppointments })}
              >
                +{dayAppointments.length - 2} more
              </button>
            )}
          </div>
        </div>,
      )

      if ((startingDayOfWeek + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-0">
            {days}
          </div>,
        )
        days = []
      }
    }

    return weeks
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments Management</h1>
          <p className="text-muted-foreground">View and manage patient appointments</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
              <span className="text-xl font-bold text-white">{stats.pending}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <span className="text-xl font-bold text-white">{stats.confirmed}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "calendar")}>
          <TabsList>
            <TabsTrigger value="table">
              <List className="mr-2 h-4 w-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Grid className="mr-2 h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, doctor, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Status" />
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
      </Card>

      {viewMode === "table" ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Loading appointments...
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <TableRow key={appointment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{appointment.appointmentDate}</div>
                          <div className="text-muted-foreground">{appointment.appointmentTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
                            {appointment.patientName.charAt(0)}
                          </div>
                          <span className="font-medium">{appointment.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{appointment.patientPhone}</TableCell>
                      <TableCell className="text-sm">{appointment.doctorName || "N/A"}</TableCell>
                      <TableCell className="text-sm">{appointment.specialization}</TableCell>
                      <TableCell>
                        <Select
                          value={appointment.status}
                          onValueChange={(value) => handleStatusChange(appointment.id!, value)}
                        >
                          <SelectTrigger className="h-8 w-[120px]">
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth("prev")}
                className="h-9 w-9 hover:bg-cyan-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth("next")}
                className="h-9 w-9 hover:bg-cyan-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={goToToday}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
            >
              Today
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-7 gap-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="bg-white">{renderCalendar()}</div>
          </div>
        </Card>
      )}

      <Dialog open={!!selectedDateAppointments} onOpenChange={() => setSelectedDateAppointments(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Appointments on {selectedDateAppointments?.date}</DialogTitle>
            <DialogDescription>
              {selectedDateAppointments?.appointments.length || 0} appointment(s) scheduled
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedDateAppointments?.appointments.map((apt) => (
              <Card key={apt.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.appointmentTime}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Doctor: {apt.doctorName || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Specialization: {apt.specialization}</p>
                  </div>
                  <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
            <DialogDescription>Create a new appointment for a patient</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                placeholder="Enter patient name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patientEmail">Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={newAppointment.patientEmail}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patientPhone">Phone *</Label>
                <Input
                  id="patientPhone"
                  value={newAppointment.patientPhone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                  placeholder="1234567890"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patientAge">Age</Label>
                <Input
                  id="patientAge"
                  type="number"
                  value={newAppointment.patientAge}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientAge: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patientGender">Gender</Label>
                <Select
                  value={newAppointment.patientGender}
                  onValueChange={(value: "male" | "female" | "other") =>
                    setNewAppointment({ ...newAppointment, patientGender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doctor">Doctor *</Label>
              <Select
                value={newAppointment.doctorId}
                onValueChange={(value) => {
                  const selectedDoctor = doctors.find(d => d.id?.toString() === value)
                  setNewAppointment({
                    ...newAppointment,
                    doctorId: value,
                    specialization: selectedDoctor?.specialization || ""
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id?.toString() || ""}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="appointmentTime">Time *</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  value={newAppointment.appointmentTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAppointment}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Create Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
