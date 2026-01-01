"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DoctorViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: any | null
}

export function DoctorViewDialog({ open, onOpenChange, doctor }: DoctorViewDialogProps) {
  if (!doctor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={doctor.profilePicture || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                <Badge variant={doctor.isActive ? "default" : "secondary"}>
                  {doctor.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-lg text-blue-600 font-medium">{doctor.specialization}</p>
              <p className="text-sm text-gray-600">{doctor.qualification}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-semibold">{doctor.experience} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="font-semibold">₹{doctor.consultationFee}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{doctor.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{doctor.phone}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500 mb-1">OPD Timings</p>
            <p className="font-semibold">{doctor.opdTimings}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {doctor.language?.map((lang: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Biography</p>
            <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
