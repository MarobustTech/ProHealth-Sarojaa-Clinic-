"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit2, Trash2, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BannerFormDialog } from "@/components/admin/banner-form-dialog"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import type { Banner } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    imageUrl: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      const data = await api.getBanners()
      setBanners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch banners:", error)
    }
  }

  const filteredBanners = banners.filter((banner) =>
    (banner.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddBanner = async () => {
    if (!formData.imageUrl) {
      toast({
        title: "Error",
        description: "Please provide an image URL",
        variant: "destructive",
      })
      return
    }

    try {
      await api.createBanner({
        title: `Banner ${Date.now()}`, // Use timestamp as unique title
        description: "",
        image: formData.imageUrl,
        buttonText: "",
        buttonLink: "",
        order: banners.length + 1,
        isActive: true,
      })

      toast({
        title: "Success",
        description: "Banner added successfully",
      })
      loadBanners()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add banner",
        variant: "destructive",
      })
    }
  }

  const handleEditBanner = async () => {
    if (!selectedBanner || !formData.imageUrl) return

    try {
      await api.updateBanner(selectedBanner.id!, {
        ...selectedBanner,
        image: formData.imageUrl,
      })

      toast({
        title: "Success",
        description: "Banner updated successfully",
      })
      loadBanners()
      setIsEditDialogOpen(false)
      setSelectedBanner(null)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBanner = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      await api.deleteBanner(id)
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      })
      loadBanners()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete banner",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (banner: Banner) => {
    try {
      await api.toggleBannerActive(banner.id!)
      loadBanners()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle banner status",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner)
    setFormData({
      imageUrl: banner.image || "",
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      imageUrl: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Banner Management</h1>
          <p className="text-muted-foreground">Manage homepage banners and promotional content</p>
        </div>
        <Button
          onClick={() => {
            setSelectedBanner(null)
            setIsAddDialogOpen(true)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {filteredBanners.length > 0 ? (
        <div className="grid gap-4">
          {filteredBanners.map((banner) => (
            <Card key={banner.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title || "Banner"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute right-4 top-4">
                  <Badge
                    variant={banner.isActive ? "default" : "secondary"}
                    className={banner.isActive ? "bg-green-500 shadow-md" : "bg-gray-500"}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">Active</span>
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={() => handleToggleStatus(banner)}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => openEditDialog(banner)}
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleDeleteBanner(banner.id!)}
                        className="h-8 w-8 bg-white/90 text-red-600 hover:bg-white hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-6">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No banners found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first banner to get started</p>
            <Button
              onClick={() => {
                setSelectedBanner(null)
                setIsAddDialogOpen(true)
              }}
              className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </div>
        </Card>
      )}

      {/* Add/Edit Dialog using the separate component */}
      <BannerFormDialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
            setSelectedBanner(null)
          }
        }}
        banner={selectedBanner}
        onSuccess={() => {
          loadBanners()
          toast({
            title: "Success",
            description: selectedBanner ? "Banner updated successfully" : "Banner created successfully"
          })
        }}
      />
    </div>
  )
}
```
