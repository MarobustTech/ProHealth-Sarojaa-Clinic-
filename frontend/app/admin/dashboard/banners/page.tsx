"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, ImageIcon, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { BannerFormDialog } from "@/components/admin/banner-form-dialog"
import { getAuthToken } from "@/lib/admin-auth"
import { ConnectionStatus } from "@/components/admin/connection-status"
import { useToast } from "@/hooks/use-toast"

export default function BannersPage() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setIsLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Don't clear token or redirect - just show empty state
          console.warn("401 Unauthorized - Token may be invalid, but staying on page")
          setBanners([])
          return
        }
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      const bannersArray = Array.isArray(data) ? data : []
      setBanners(bannersArray)
    } catch (error: any) {
      console.error("Failed to fetch banners:", error)
      setBanners([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (bannerId: string | number) => {
    // Find banner by id or _id
    const banner = banners.find((b) => b.id === bannerId || b._id === bannerId || String(b.id) === String(bannerId) || String(b._id) === String(bannerId))
    if (!banner) {
      console.error("Banner not found:", bannerId, "Available banners:", banners.map(b => ({ id: b.id, _id: b._id })))
      return
    }

    // Get the numeric ID for the API
    let id: number
    if (typeof bannerId === 'string') {
      id = parseInt(bannerId, 10)
      if (isNaN(id)) {
        // Try to extract from banner object
        id = banner.id || parseInt(String(banner._id || bannerId), 10)
      }
    } else {
      id = bannerId
    }

    if (isNaN(id) || id <= 0) {
      console.error("Invalid banner ID:", bannerId, "Parsed:", id)
      toast({
        title: "Error",
        description: "Invalid banner ID",
        variant: "destructive",
      })
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update banner status",
          variant: "destructive",
        })
        return
      }
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/banners/${id}/toggle-active`
      console.log("Toggling banner:", id, "URL:", apiUrl, "Token present:", !!token)
      
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Toggle response status:", response.status, response.statusText)

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Unable to update. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          // Don't clear token or redirect - user stays on page
          return
        }
        throw new Error(`Failed to toggle: ${response.status}`)
      }
      
      fetchBanners()
    } catch (error) {
      console.error("Failed to toggle banner:", error)
    }
  }

  const handleDelete = async (bannerId: string | number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    // Get the numeric ID for the API
    let id: number
    if (typeof bannerId === 'string') {
      id = parseInt(bannerId, 10)
      if (isNaN(id)) {
        const banner = banners.find((b) => b.id === bannerId || b._id === bannerId || String(b.id) === String(bannerId) || String(b._id) === String(bannerId))
        id = banner?.id || parseInt(String(banner?._id || bannerId), 10)
      }
    } else {
      id = bannerId
    }

    if (isNaN(id) || id <= 0) {
      console.error("Invalid banner ID for deletion:", bannerId)
      toast({
        title: "Error",
        description: "Invalid banner ID",
        variant: "destructive",
      })
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to delete banner",
          variant: "destructive",
        })
        return
      }
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/banners/${id}`
      console.log("Deleting banner:", id, "URL:", apiUrl)
      
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Unable to delete. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          // Don't clear token or redirect - user stays on page
          return
        }
        throw new Error(`Failed to delete: ${response.status}`)
      }
      
      fetchBanners()
    } catch (error) {
      console.error("Failed to delete banner:", error)
    }
  }

  const filteredBanners = banners.filter((banner) => banner.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-8">
      <ConnectionStatus />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            Banner Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage homepage banners and promotional content</p>
        </div>
        <Button
          onClick={() => {
            setEditingBanner(null)
            setIsDialogOpen(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6 border-2">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </Card>

      {/* Banners Grid */}
      <div className="grid gap-6">
        {filteredBanners.map((banner, index) => (
          <Card
            key={banner._id || banner.id || `banner-${index}`}
            className="p-6 border-2 hover:shadow-xl transition-all hover:border-primary/20 relative overflow-hidden"
          >
            <div className="flex gap-6">
              {/* Banner Preview Image */}
              <div className="w-48 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                {banner.image ? (
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{banner.description}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                {banner.buttonText && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">CTA:</span>
                    <span>
                      {banner.buttonText} → {banner.buttonLink}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(banner.id || banner._id)}
                    className="text-xs"
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBanner(banner)
                      setIsDialogOpen(true)
                    }}
                    className="text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id || banner._id)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredBanners.length === 0 && (
          <Card className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No banners found</h3>
            <p className="text-muted-foreground mb-6">Create your first banner to get started</p>
            <Button
              onClick={() => {
                setEditingBanner(null)
                setIsDialogOpen(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </Card>
        )}
      </div>

      <BannerFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        banner={editingBanner}
        onSuccess={fetchBanners}
      />
    </div>
  )
}
