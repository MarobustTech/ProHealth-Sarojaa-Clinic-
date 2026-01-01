"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getAdminToken } from "@/lib/admin-auth"
import { Loader2 } from "lucide-react"

interface SpecializationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  specialization: any | null
  onSuccess: () => void
}

export function SpecializationFormDialog({
  open,
  onOpenChange,
  specialization,
  onSuccess,
}: SpecializationFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  })

  useEffect(() => {
    if (specialization) {
      setFormData({
        name: specialization.name || "",
        description: specialization.description || "",
        icon: specialization.icon || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "",
      })
    }
  }, [specialization, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = getAdminToken()
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to perform this action.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      
      // Use id or _id, convert to number if needed
      const specId = specialization?.id || specialization?._id
      const url = specialization
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations/${specId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations`

      const payload = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon || null,
        isActive: true, // Default to active when creating
      }

      // If editing, include isActive from existing specialization
      if (specialization) {
        payload.isActive = specialization.isActive !== false
      }

      const response = await fetch(url, {
        method: specialization ? "PUT" : "POST",
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
          setLoading(false)
          return
        }
        const errorData = await response.json().catch(() => ({ detail: "Failed to save specialization" }))
        throw new Error(errorData.detail || errorData.message || "Failed to save specialization")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || `Specialization ${specialization ? "updated" : "added"} successfully`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save specialization",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{specialization ? "Edit Specialization" : "Add New Specialization"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Cardiology"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              placeholder="e.g., ❤️"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              maxLength={2}
            />
            <p className="text-xs text-gray-500">Optional emoji icon for visual representation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this specialization..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
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
              ) : specialization ? (
                "Update Specialization"
              ) : (
                "Add Specialization"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
