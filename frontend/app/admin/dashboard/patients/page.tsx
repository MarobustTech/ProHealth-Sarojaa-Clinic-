"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import type { Patient, Appointment } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPatients()
    loadAppointments()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await api.getPatients()
      setPatients(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to fetch patients:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch patients",
        variant: "destructive",
      })
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const loadAppointments = async () => {
    try {
      const data = await api.getAppointments()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error)
      setAppointments([])
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openViewDialog = (patient: Patient) => {
    setSelectedPatient(patient)
    // Filter appointments by patient name (since we don't have patientId in current schema)
    const patientAppts = appointments.filter((appt) => appt.patientName === patient.name)
    setPatientAppointments(patientAppts)
    setIsViewDialogOpen(true)
  }

  const getStatusBadgeColor = (status: string) => {
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
          <h1 className="text-3xl font-bold text-blue-600">Patient Management</h1>
          <p className="text-muted-foreground">View patient details and appointment history</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Loading patients...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white">
                    {patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-lg font-semibold">{patient.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {patient.age && <span>{patient.age} yrs</span>}
                  {patient.age && patient.gender && <span>•</span>}
                  {patient.gender && (
                    <Badge variant="outline" className="text-xs">
                      {patient.gender}
                    </Badge>
                  )}
                </div>

                <div className="mt-4 w-full space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {patient.email}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {patient.phone}
                  </div>
                  {patient.address && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {patient.address}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:text-white"
                  onClick={() => openViewDialog(patient)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Patient Information</TabsTrigger>
                <TabsTrigger value="history">Appointment History</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-3xl text-white">
                      {selectedPatient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      {selectedPatient.age && (
                        <span className="text-muted-foreground">{selectedPatient.age} years old</span>
                      )}
                      {selectedPatient.age && selectedPatient.gender && <span>•</span>}
                      {selectedPatient.gender && <Badge variant="outline">{selectedPatient.gender}</Badge>}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 rounded-lg border p-4">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="col-span-2 text-sm text-muted-foreground">{selectedPatient.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="col-span-2 text-sm text-muted-foreground">{selectedPatient.phone}</span>
                    </div>
                    {selectedPatient.age && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium">Age:</span>
                        <span className="col-span-2 text-sm text-muted-foreground">{selectedPatient.age} years</span>
                      </div>
                    )}
                    {selectedPatient.gender && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium">Gender:</span>
                        <span className="col-span-2 text-sm text-muted-foreground">{selectedPatient.gender}</span>
                      </div>
                    )}
                    {selectedPatient.address && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-medium">Address:</span>
                        <span className="col-span-2 text-sm text-muted-foreground">{selectedPatient.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 py-4">
                {patientAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {patientAppointments.map((appt) => (
                      <Card key={appt.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{appt.doctorName || "N/A"}</h4>
                              <Badge variant="outline" className="text-xs">
                                {appt.specialization}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {appt.appointmentDate} at {appt.appointmentTime}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusBadgeColor(appt.status)}>{appt.status}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">No appointment history available</div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
