"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Mail, Phone, Stethoscope, FileText } from "lucide-react"
import { format } from "date-fns"

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any | null
}

export function AppointmentDetailsDialog({ open, onOpenChange, appointment }: AppointmentDetailsDialogProps) {
  if (!appointment) return null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Booking Information</h3>
            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Patient Name</p>
              </div>
              <p className="text-gray-900 font-semibold">{appointment.patientName}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
              </div>
              <p className="text-gray-900 font-semibold">{appointment.patientPhone}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Email Address</p>
              </div>
              <p className="text-gray-900 font-semibold">{appointment.patientEmail}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Doctor</p>
              </div>
              <p className="text-gray-900 font-semibold">{appointment.doctorName}</p>
              <p className="text-xs text-gray-500">{appointment.specialization}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Appointment Date</p>
              </div>
              <p className="text-gray-900 font-semibold">
                {format(new Date(appointment.appointmentDate), "MMMM dd, yyyy")}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Appointment Time</p>
              </div>
              <p className="text-gray-900 font-semibold">{appointment.appointmentTime}</p>
            </div>
          </div>

          {appointment.reason && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">Reason for Visit</p>
                </div>
                <p className="text-gray-700 leading-relaxed">{appointment.reason}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500">
              Booked on: {format(new Date(appointment.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
