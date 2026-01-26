"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAuthToken } from "@/lib/admin-auth"

interface BannerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: any
  onSuccess: () => void
}

export function BannerFormDialog({ open, onOpenChange, banner, onSuccess }: BannerFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    buttonText: "",
    buttonLink: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || "",
        description: banner.description || "",
        image: banner.image || "",
        buttonText: banner.buttonText || "",
        buttonLink: banner.buttonLink || "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        buttonText: "",
        buttonLink: "",
      })
    }
  }, [banner, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = getAuthToken()
      if (!token) {
        alert("Authentication required. Please log in.")
        return
      }

      // Get the numeric ID for edit
      let bannerId: number | undefined
      if (banner) {
        bannerId = banner.id || (typeof banner._id === 'number' ? banner._id : parseInt(String(banner._id || ''), 10))
        if (isNaN(bannerId || 0)) {
          console.error("Invalid banner ID for edit:", banner)
          alert("Invalid banner ID. Please refresh and try again.")
          return
        }
      }

      const url = bannerId
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/banners/${bannerId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/banners`

      console.log("Saving banner:", bannerId ? "Edit" : "Create", "URL:", url)

      const response = await fetch(url, {
        method: bannerId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      console.log("Banner save response status:", response.status)

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        if (response.status === 401) {
          alert("Authentication failed. Please log out and log back in.")
          return
        }
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.detail || errorData.message || `Failed to save banner: ${response.status}`)
      }
    } catch (error) {
      alert("Failed to save banner. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{banner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter banner title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              placeholder="Enter banner description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Banner Image *</Label>
            <div className="flex flex-col gap-4">
              {/* Hidden URL input to maintain state */}
              <Input
                type="hidden"
                id="image"
                value={formData.image}
                required
              />

              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // Create form data
                  const data = new FormData();
                  data.append("file", file);

                  setIsSubmitting(true);
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload`, {
                      method: "POST",
                      body: data
                    });

                    if (!response.ok) throw new Error("Upload failed");

                    const result = await response.json();
                    setFormData({ ...formData, image: result.url });
                  } catch (err) {
                    alert("Failed to upload image");
                    console.error(err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />

              {formData.image && (
                <div className="text-xs text-muted-foreground break-all">
                  URL: {formData.image}
                </div>
              )}
            </div>
            {formData.image && (
              <div className="mt-2 rounded-lg overflow-hidden border">
                <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Book Now"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/book"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              {isSubmitting ? "Saving..." : banner ? "Update Banner" : "Add Banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
