"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, UserSquare2, Calendar, Activity, Phone, Mail, MapPin } from "lucide-react"
import { getAuthToken } from "@/lib/admin-auth"
import { PatientDetailsDialog } from "@/components/admin/patient-details-dialog"

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        // Don't log error, just silently return - auth guard will handle redirect
        setLoading(false)
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Don't clear token or redirect - just show empty state
          // User stays on page unless they explicitly log out
          console.warn("401 Unauthorized - Token may be invalid, but staying on page")
          setPatients([])
          return
        }
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data = await response.json()
      // Ensure data is an array
      const patientsArray = Array.isArray(data) ? data : []
      
      // Debug: Log first patient to see appointments structure
      if (patientsArray.length > 0) {
        console.log("Sample patient data:", {
          name: patientsArray[0].name,
          email: patientsArray[0].email,
          appointmentsCount: patientsArray[0].appointments?.length || 0,
          appointments: patientsArray[0].appointments
        })
      }
      
      setPatients(patientsArray)
    } catch (error: any) {
      console.error("Failed to fetch patients:", error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery),
  )

  const getPatientAppointments = (patient: any) => {
    // Appointments are included in patient data from API
    return Array.isArray(patient.appointments) ? patient.appointments : []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-2">
            Patient Management
          </h1>
          <p className="text-gray-600">View patient details and appointment history</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const appointments = getPatientAppointments(patient)
          // Get unique doctors from appointments (filter out null/undefined doctor names)
          const uniqueDoctors = new Set(
            appointments
              .map((appt: any) => appt.doctorName)
              .filter((name: string) => name != null && name !== "")
          ).size

          return (
            <Card
              key={patient.id || patient._id || `patient-${patient.email}`}
              className="hover:shadow-xl transition-all duration-300 border-gray-200 bg-white hover:scale-105 group"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <UserSquare2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{patient.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200"
                        >
                          {patient.age} yrs
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200"
                        >
                          {patient.bloodGroup}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-teal-500" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="truncate">{patient.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{appointments.length}</p>
                      <p className="text-xs text-blue-600 font-medium">Appointments</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100">
                      <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                        <Activity className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-bold text-teal-700">{uniqueDoctors}</p>
                      <p className="text-xs text-teal-600 font-medium">Doctors</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedPatient(patient)}
                    className="w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 hover:from-indigo-700 hover:via-blue-600 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <UserSquare2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No patients found</p>
        </div>
      )}

      {selectedPatient && (
        <PatientDetailsDialog
          patient={selectedPatient}
          appointments={getPatientAppointments(selectedPatient)}
          open={!!selectedPatient}
          onOpenChange={(open) => !open && setSelectedPatient(null)}
        />
      )}
    </div>
  )
}
