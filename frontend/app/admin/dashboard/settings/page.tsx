"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Database, Shield } from "lucide-react"
import { getAdminUser, getAdminToken } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function SettingsPage() {
  const { toast } = useToast()
  const adminUser = getAdminUser()
  const [loading, setLoading] = useState(false)

  const [hospitalSettings, setHospitalSettings] = useState({
    name: "Sree Sarojaa Multi Specialty Dental Clinic",
    email: adminUser?.email || "admin@prohealth.com",
    phone: "1234567890",
    address: "123 Health Street, Medical District",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600001",
  })

  // Notification settings removed

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Load settings from backend
  useEffect(() => {
    loadHospitalSettings()
  }, [])

  const loadHospitalSettings = async () => {
    try {
      const token = getAdminToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/admin/settings/hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.settings) {
          setHospitalSettings(data.settings)
        }
      }
    } catch (error) {
      console.error("Failed to load hospital settings:", error)
    }
  }

  const handleSaveHospitalSettings = async () => {
    try {
      setLoading(true)
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update settings",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${API_URL}/api/admin/settings/hospital`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hospitalSettings),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message || "Hospital settings saved successfully!",
        })
      } else {
        throw new Error(data.detail || "Failed to save settings")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save hospital settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const token = getAdminToken()
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to change password",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${API_URL}/api/admin/settings/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message || "Password changed successfully!",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        throw new Error(data.detail || "Failed to change password")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your hospital and system preferences</p>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="data">
            <Database className="mr-2 h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your hospital data and backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground">Download all your hospital data as Excel or PDF</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const token = getAdminToken()
                        const response = await fetch(`${API_URL}/api/admin/export/excel`, {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                        if (response.ok) {
                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `hospital_data_${new Date().getTime()}.csv`
                          a.click()
                          toast({
                            title: "Success",
                            description: "Data exported as Excel successfully",
                          })
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to export data",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Export as Excel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const token = getAdminToken()
                        const response = await fetch(`${API_URL}/api/admin/export/pdf`, {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                        if (response.ok) {
                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `hospital_summary_${new Date().getTime()}.txt`
                          a.click()
                          toast({
                            title: "Success",
                            description: "Data exported as PDF successfully",
                          })
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to export data",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Export as PDF
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Clear Cache</h3>
                <p className="text-sm text-muted-foreground">Clear temporary data to improve performance</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm("Are you sure you want to clear the cache? This action cannot be undone.")) {
                      localStorage.clear()
                      sessionStorage.clear()
                      toast({
                        title: "Success",
                        description: "Cache cleared successfully",
                      })
                    }
                  }}
                >
                  Clear Cache
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Irreversible actions that affect your data</p>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const confirmation = confirm(
                      "⚠️ WARNING: This will delete ALL data permanently!\n\nAre you absolutely sure you want to reset all data? This action CANNOT be undone!"
                    )
                    if (confirmation) {
                      const doubleConfirmation = confirm(
                        "This is your FINAL warning!\n\nType 'DELETE' in the next prompt to confirm."
                      )
                      if (doubleConfirmation) {
                        const userInput = prompt("Type 'DELETE' to confirm:")
                        if (userInput === "DELETE") {
                          toast({
                            title: "Data Reset",
                            description: "All data has been reset (feature not implemented yet)",
                            variant: "destructive",
                          })
                          // TODO: Implement actual data reset via backend API
                        } else {
                          toast({
                            title: "Cancelled",
                            description: "Data reset cancelled",
                          })
                        }
                      }
                    }
                  }}
                >
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your account password</p>
                <div className="grid max-w-md gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                    className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
