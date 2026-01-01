"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react"
import { SpecializationFormDialog } from "@/components/admin/specialization-form-dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { getAdminToken } from "@/lib/admin-auth"
import { ConnectionStatus } from "@/components/admin/connection-status"

interface Specialization {
  _id: string
  name: string
  description: string
  icon?: string
  isActive: boolean
}

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [filteredSpecs, setFilteredSpecs] = useState<Specialization[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState<Specialization | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Always fetch specializations when component mounts
    fetchSpecializations()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = specializations.filter(
        (spec) =>
          spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spec.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredSpecs(filtered)
    } else {
      setFilteredSpecs(specializations)
    }
  }, [searchQuery, specializations])

  const fetchSpecializations = async () => {
    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view specializations",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations/all`
      console.log("Fetching specializations from:", apiUrl)
      console.log("Token present:", !!token)
      
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      console.log("Specializations API response status:", response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Specializations API error response:", errorText)
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminUser")
          }
          // Don't redirect here - let the auth guard handle it
          setSpecializations([])
          setFilteredSpecs([])
          return
        }
        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log("Specializations API response data:", data)
      console.log("Response type:", typeof data, "Is array:", Array.isArray(data))
      const specsArray = Array.isArray(data) ? data : []
      console.log("Specializations array length:", specsArray.length)
      
      if (specsArray.length === 0) {
        console.warn("⚠️ No specializations returned from API!")
        console.warn("Full response:", JSON.stringify(data, null, 2))
      } else {
        console.log("✅ Successfully loaded", specsArray.length, "specializations")
        console.log("First specialization:", specsArray[0])
      }
      
      setSpecializations(specsArray)
      setFilteredSpecs(specsArray)
    } catch (error: any) {
      console.error("Failed to fetch specializations:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch specializations. Please check your connection.",
        variant: "destructive",
      })
      setSpecializations([])
      setFilteredSpecs([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (specId: string | number, currentStatus: boolean) => {
    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update specialization status",
          variant: "destructive",
        })
        return
      }
      
      // Ensure specId is a number (backend expects int)
      // Handle both id and _id formats
      let id: number
      if (typeof specId === 'string') {
        id = parseInt(specId, 10)
        if (isNaN(id)) {
          // Try to extract number from string
          const numMatch = specId.match(/\d+/)
          if (numMatch) {
            id = parseInt(numMatch[0], 10)
          } else {
            toast({
              title: "Error",
              description: "Invalid specialization ID format",
              variant: "destructive",
            })
            return
          }
        }
      } else {
        id = specId
      }
      
      if (isNaN(id) || id <= 0) {
        toast({
          title: "Error",
          description: "Invalid specialization ID",
          variant: "destructive",
        })
        return
      }
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations/${id}/toggle-active`
      console.log("Toggling specialization - ID:", id, "Type:", typeof id, "URL:", apiUrl)
      console.log("Token present:", !!token, "Token length:", token?.length)
      
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
          const errorText = await response.text().catch(() => "Unauthorized")
          console.warn("401 Unauthorized - Token may be invalid, but staying on page. Response:", errorText)
          // Don't clear token or redirect - user stays on page
          toast({
            title: "Authentication Error",
            description: "Unable to update. Please check your connection or try logging out and back in.",
            variant: "destructive",
          })
          return
        }
        const errorData = await response.json().catch(() => ({}))
        console.error("Toggle failed:", errorData)
        throw new Error(errorData.detail || errorData.message || `Failed to update: ${response.status}`)
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || `Specialization ${!currentStatus ? "activated" : "deactivated"} successfully`,
      })
      // Refresh the list to show updated status
      await fetchSpecializations()
    } catch (error: any) {
      console.error("Failed to toggle specialization:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update specialization status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (specId: string | number) => {
    if (!confirm("Are you sure you want to delete this specialization?")) return

    try {
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to delete specialization",
          variant: "destructive",
        })
        return
      }
      
      // Ensure specId is a number (backend expects int)
      const id = typeof specId === 'string' ? parseInt(specId, 10) : specId
      if (isNaN(id)) {
        toast({
          title: "Error",
          description: "Invalid specialization ID",
          variant: "destructive",
        })
        return
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to delete: ${response.status}`)
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || "Specialization deleted successfully",
      })
      await fetchSpecializations()
    } catch (error: any) {
      console.error("Failed to delete specialization:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete specialization",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (spec: Specialization) => {
    setSelectedSpec(spec)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedSpec(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <ConnectionStatus />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Specializations Management</h1>
          <p className="text-gray-500 mt-1">Manage medical specializations and departments</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Specialization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading specializations...</p>
          ) : filteredSpecs.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No specializations found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSpecs.map((spec, index) => (
                <div key={spec._id || spec.id || `spec-${index}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {spec.icon && <span className="text-2xl">{spec.icon}</span>}
                        <h3 className="font-semibold text-gray-900">{spec.name}</h3>
                      </div>
                      <Badge variant={spec.isActive ? "default" : "secondary"} className="mb-2">
                        {spec.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <p className="text-sm text-gray-600 line-clamp-2">{spec.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Active</span>
                      <Switch
                        checked={spec.isActive}
                        onCheckedChange={() => {
                          const specId = spec.id || spec._id
                          if (!specId) {
                            toast({
                              title: "Error",
                              description: "Specialization ID is missing",
                              variant: "destructive",
                            })
                            return
                          }
                          handleToggleActive(specId, spec.isActive)
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(spec)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(spec._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SpecializationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        specialization={selectedSpec}
        onSuccess={fetchSpecializations}
      />
    </div>
  )
}
