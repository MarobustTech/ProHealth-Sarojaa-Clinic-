"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getAdminToken } from "@/lib/admin-auth"
import { Loader2 } from "lucide-react"

interface DoctorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: any | null
  onSuccess: () => void
}

export function DoctorFormDialog({ open, onOpenChange, doctor, onSuccess }: DoctorFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [specializations, setSpecializations] = useState<any[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
    consultationFee: "",
    opdTimings: "",
    language: "",
    bio: "",
    profilePicture: "",
  })

  useEffect(() => {
    fetchSpecializations()
  }, [])

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience?.toString() || "",
        qualification: doctor.qualification || "",
        consultationFee: doctor.consultationFee?.toString() || "",
        opdTimings: doctor.opdTimings || "",
        language: doctor.language?.join(", ") || "",
        bio: doctor.bio || "",
        profilePicture: doctor.profilePicture || "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        qualification: "",
        consultationFee: "",
        opdTimings: "",
        language: "",
        bio: "",
        profilePicture: "",
      })
    }
  }, [doctor, open])

  const fetchSpecializations = async () => {
    try {
      const token = getAdminToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = await response.json()
      setSpecializations(data)
    } catch (error) {
      console.error("Failed to fetch specializations")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.specialization) {
      toast({
        title: "Validation Error",
        description: "Specialization is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.qualification.trim()) {
      toast({
        title: "Validation Error",
        description: "Qualification is required",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)

    try {
      const token = getAdminToken()
      const doctorId = doctor?.id || doctor?._id
      const url = doctorId
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/doctors/${doctorId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/doctors`

      // Parse numbers safely
      const experience = formData.experience ? parseInt(formData.experience, 10) : undefined
      const consultationFee = formData.consultationFee ? parseFloat(formData.consultationFee) : undefined
      
      // Handle languages - split by comma and trim
      const languages = formData.language 
        ? formData.language.split(",").map((l) => l.trim()).filter((l) => l.length > 0)
        : []

      const payload: any = {
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification, // Required field
        languages: languages, // Use 'languages' not 'language'
        isActive: true, // Default to active
      }

      // Add optional fields only if they have values
      if (formData.email) {
        payload.email = formData.email
      }
      if (formData.phone) {
        payload.phone = formData.phone
      }
      if (experience !== undefined && !isNaN(experience)) {
        payload.experience = experience
      }
      if (consultationFee !== undefined && !isNaN(consultationFee)) {
        payload.consultationFee = consultationFee
      }
      if (formData.opdTimings) {
        payload.opdTimings = formData.opdTimings
      }
      if (formData.bio) {
        payload.bio = formData.bio
      }
      if (formData.profilePicture) {
        payload.profilePicture = formData.profilePicture
      }
      
      // If editing, preserve isActive status
      if (doctor) {
        payload.isActive = doctor.isActive !== false
      }

      const response = await fetch(url, {
        method: doctor ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Unable to save. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          // Don't clear token or redirect - user stays on page
          return
        }
        const errorData = await response.json().catch(() => ({ detail: "Failed to save doctor" }))
        throw new Error(errorData.detail || errorData.message || "Failed to save doctor")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || `Doctor ${doctor ? "updated" : "added"} successfully`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to save doctor:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save doctor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec, index) => (
                    <SelectItem key={spec.id || spec._id || `spec-${index}`} value={spec.name}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
              <Input
                id="consultationFee"
                type="number"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification *</Label>
            <Input
              id="qualification"
              placeholder="e.g., MBBS, MD"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opdTimings">OPD Timings</Label>
            <Input
              id="opdTimings"
              placeholder="e.g., Mon-Fri: 9 AM - 5 PM"
              value={formData.opdTimings}
              onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Languages (comma-separated)</Label>
            <Input
              id="language"
              placeholder="e.g., English, Hindi, Tamil"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture URL</Label>
            <Input
              id="profilePicture"
              placeholder="https://example.com/image.jpg"
              value={formData.profilePicture}
              onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Doctor's biography and expertise..."
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : doctor ? (
                "Update Doctor"
              ) : (
                "Add Doctor"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
