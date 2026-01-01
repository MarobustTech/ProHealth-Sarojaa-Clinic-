"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  UserSquare2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Stethoscope,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"

interface PatientDetailsDialogProps {
  patient: any
  appointments: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientDetailsDialog({ patient, appointments, open, onOpenChange }: PatientDetailsDialogProps) {
  // Helper function to safely format dates
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "N/A"
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return "N/A"
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      return "N/A"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Patient Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Patient Info Card */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                  <UserSquare2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">{patient.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                      {patient.age} years
                    </Badge>
                    <Badge variant="outline" className="border-blue-300">
                      {patient.gender}
                    </Badge>
                    <Badge variant="outline" className="border-teal-300">
                      {patient.bloodGroup}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80">
                  <Phone className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Emergency Contact</p>
                    <p className="text-sm font-medium">{patient.emergencyContact}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Address</p>
                    <p className="text-sm font-medium">{patient.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Registered Date</p>
                    <p className="text-sm font-medium">{formatDate(patient.registeredDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80">
                  <Activity className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Last Visit</p>
                    <p className="text-sm font-medium">{formatDate(patient.lastVisit)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          {(() => {
            // Ensure medicalHistory is always an array
            const medicalHistory = Array.isArray(patient.medicalHistory)
              ? patient.medicalHistory
              : patient.medicalHistory
              ? [patient.medicalHistory]
              : []
            
            return medicalHistory.length > 0 && (
              <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Medical History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.map((condition: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-white border-purple-200 text-purple-700 px-3 py-1"
                      >
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })()}

          {/* Appointment History */}
          <Card className="border-2 border-teal-100 bg-gradient-to-br from-teal-50/50 to-emerald-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-teal-600" />
                Appointment History ({appointments.length} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No appointments found</p>
                ) : (
                  appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">{appointment.specialization}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-teal-500" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>
                      {appointment.symptoms && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Symptoms:</p>
                          <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
