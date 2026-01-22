"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Heart,
  CheckCircle2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Check,
  Award,
  GraduationCap,
  Loader2,
  DollarSign,
  Clock,
  Languages,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import {
  getActiveSpecializations,
  getActiveDoctorsBySpecialization,
  createAppointment,
  type Doctor,
  type Specialization,
} from "@/lib/api"

// Time slots are now fetched dynamically from API based on selected date

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay()
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function BookAppointmentPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(true)
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false)

  const [selectedService, setSelectedService] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDoctorData, setSelectedDoctorData] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
  })
  const [bookingToken, setBookingToken] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)

  useEffect(() => {
    const fetchSpecializations = async () => {
      setIsLoadingSpecializations(true)
      try {
        const data = await getActiveSpecializations()
        setSpecializations(data)
      } catch (error) {
        console.error("Error fetching specializations:", error)
        // Optionally set an error state here
      } finally {
        setIsLoadingSpecializations(false)
      }
    }
    fetchSpecializations()
  }, [])

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam && specializations.length > 0) {
      const matchingSpec = specializations.find(
        (s) => s.name.toLowerCase().replace(/\s+/g, "-") === serviceParam.toLowerCase(),
      )
      if (matchingSpec) {
        setSelectedService(matchingSpec.name)
      }
    }
  }, [searchParams, specializations])

  useEffect(() => {
    if (selectedService && currentStep === 1) {
      const fetchAndSelectDoctor = async () => {
        setIsLoadingDoctors(true)
        try {
          const data = await getActiveDoctorsBySpecialization(selectedService)
          setDoctors(data)

          if (data && data.length > 0) {
            const doc = data[0]
            setSelectedDoctor(doc.name)
            setSelectedDoctorData(doc)
            setCurrentStep(3)
          } else {
            setCurrentStep(2) // Fallback to show no doctors message
          }
        } catch (error) {
          console.error("Error fetching doctors:", error)
          setCurrentStep(2)
        } finally {
          setIsLoadingDoctors(false)
        }
      }
      fetchAndSelectDoctor()
    }
  }, [selectedService, currentStep])

  // Fetch time slots when date is selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !selectedDoctorData) {
        console.log('No date or doctor selected:', { selectedDate, selectedDoctorData })
        setTimeSlots([])
        return
      }

      setIsLoadingTimeSlots(true)
      try {
        // Construct date string using local time components to avoid timezone shifts
        // (toISOString converts to UTC which can shift the date back by one day)
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const doctorId = selectedDoctorData.id

        console.log('Fetching time slots for:', { doctorId, dateStr, dayOfWeek: selectedDate.getDay() })

          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/bot/availability?doctor_id=${doctorId}&date=${dateStr}`

        console.log('API Response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('API Response data:', data)

          // Convert 24-hour format to 12-hour format with AM/PM
          const formattedSlots = data
            .filter((slot: any) => slot.available)
            .map((slot: any) => {
              const [hours, minutes] = slot.time.split(':')
              const hour = parseInt(hours)
              const period = hour >= 12 ? 'PM' : 'AM'
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
              return `${displayHour}:${minutes} ${period}`
            })

          console.log('Formatted slots:', formattedSlots)
          setTimeSlots(formattedSlots)
        } else {
          console.error('API error:', response.status, response.statusText)
          setTimeSlots([])
        }
      } catch (error) {
        console.error('Error fetching time slots:', error)
        setTimeSlots([])
      } finally {
        setIsLoadingTimeSlots(false)
      }
    }

    fetchTimeSlots()
  }, [selectedDate, selectedDoctorData])

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        alert("Please select date and time")
        return
      }

      const appointmentDate = new Date(selectedDate)
      const [timePart, period] = selectedTime.split(" ")
      let [hours, minutes] = timePart.split(":").map(Number)

      if (period === "PM" && hours !== 12) hours += 12
      if (period === "AM" && hours === 12) hours = 0

      appointmentDate.setHours(hours, minutes, 0, 0)

      const result = await createAppointment({
        patient_name: patientInfo.fullName,
        phone: patientInfo.phone,
        email: patientInfo.email,
        age: parseInt(patientInfo.age),
        gender: patientInfo.gender,
        service: selectedService,
        doctor: selectedDoctor,
        appointment_datetime: appointmentDate.toISOString(),
      })

      setBookingToken(result.token)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting booking:", error)
      alert(`Booking failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const canProceedToNextStep = () => {
    if (currentStep === 1) return selectedService !== ""
    if (currentStep === 2) return selectedDoctor !== ""
    if (currentStep === 3) return selectedDate !== null && selectedTime !== ""
    if (currentStep === 4) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const age = parseInt(patientInfo.age)
      return (
        patientInfo.fullName.trim().length > 0 &&
        patientInfo.phone.trim().length >= 10 &&
        emailRegex.test(patientInfo.email) &&
        !isNaN(age) && age >= 1 && age <= 120 &&
        patientInfo.gender.trim().length > 0
      )
    }
    return false
  }

  const renderCalendar = (monthOffset: number) => {
    const month = (currentMonth + monthOffset) % 12
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12)
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = []
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

    const headers = weekDays.map((day, i) => (
      <div key={`header-${i}`} className="text-center text-xs font-medium text-muted-foreground py-2">
        {day}
      </div>
    ))

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      date.setHours(0, 0, 0, 0)
      const isPast = date < today
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      const isToday = date.getTime() === today.getTime()

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isPast}
          onClick={() => {
            setSelectedDate(date)
            setSelectedTime("")
          }}
          className={cn(
            "aspect-square rounded-full text-sm font-medium transition-all",
            "hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary",
            isToday && !isSelected && "border-2 border-primary",
          )}
        >
          {day}
        </button>,
      )
    }

    return (
      <div className="flex-1">
        <div className="text-center font-semibold text-sm mb-3">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {headers}
          {days}
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <Card className="max-w-md w-full p-8 text-center shadow-2xl border-0 bg-white">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            Appointment Confirmed!
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your appointment is confirmed. You will receive the receipt and further assistance through our chatbot.
          </p>
          <div className="space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link href={`https://t.me/Med_ad_bot?start=apt_${bookingToken || ""}`} target="_blank">
                <MessageSquare className="w-5 h-5 mr-2" />
                Continue on Chatbot (Token: {bookingToken})
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                      currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={cn("w-12 h-1 mx-2 transition-all", currentStep > step ? "bg-primary" : "bg-muted")}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-8 text-sm font-medium">
              <span className={cn(currentStep >= 1 ? "text-primary" : "text-muted-foreground")}>Service</span>

              <span className={cn(currentStep >= 3 ? "text-primary" : "text-muted-foreground")}>Date & Time</span>
              <span className={cn(currentStep >= 4 ? "text-primary" : "text-muted-foreground")}>Your Details</span>
              <span className={cn(currentStep >= 5 ? "text-primary" : "text-muted-foreground")}>Confirm</span>
            </div>
          </div>

          <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur">
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Select a Service</h2>
                  <p className="text-muted-foreground">Choose the medical service you need</p>
                </div>

                {isLoadingSpecializations ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : specializations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No services available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {specializations.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service.name)}
                        className={cn(
                          "p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                          selectedService === service.name
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                              selectedService === service.name ? "bg-primary" : "bg-muted",
                            )}
                          >
                            <Heart
                              className={cn(
                                "w-6 h-6",
                                selectedService === service.name ? "text-primary-foreground" : "text-muted-foreground",
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          {selectedService === service.name && (
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Doctor */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Select Your Doctor</h2>
                  <p className="text-muted-foreground">Choose from our experienced specialists</p>
                </div>

                {isLoadingDoctors ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No doctors available for this specialty at the moment.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => {
                          setSelectedDoctor(doctor.name)
                          setSelectedDoctorData(doctor)
                        }}
                        className={cn(
                          "p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg",
                          selectedDoctor === doctor.name
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className="flex items-start gap-6">
                          <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg flex-shrink-0">
                            <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-bold">
                              {doctor.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                            <p className="text-primary font-semibold mb-3">{doctor.specialization}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Award className="w-4 h-4 text-primary" />
                                <span>{doctor.experience}+ years experience</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap className="w-4 h-4 text-primary" />
                                <span>{doctor.qualification}</span>
                              </div>

                              {(doctor.opdTimings || (doctor.opd_start_time && doctor.opd_end_time)) && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>
                                    Available: {doctor.opdTimings || `${doctor.opd_start_time} - ${doctor.opd_end_time}`}
                                  </span>
                                </div>
                              )}
                              {(doctor.languages || doctor.language) && (doctor.languages?.length > 0 || doctor.language?.length > 0) && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Languages className="w-4 h-4 text-primary" />
                                  <span>{(doctor.languages || doctor.language || []).join(", ")}</span>
                                </div>
                              )}
                            </div>
                            {(doctor.bio || doctor.about) && (
                              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{doctor.bio || doctor.about}</p>
                            )}
                          </div>
                          {selectedDoctor === doctor.name && <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Select Date & Time</h2>
                  <p className="text-muted-foreground">Choose your preferred appointment slot</p>
                </div>

                {/* Dual Calendar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11)
                          setCurrentYear(currentYear - 1)
                        } else {
                          setCurrentMonth(currentMonth - 1)
                        }
                      }}
                      disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="text-lg font-semibold">Select Date</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0)
                          setCurrentYear(currentYear + 1)
                        } else {
                          setCurrentMonth(currentMonth + 1)
                        }
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-8 justify-center">
                    {renderCalendar(0)}
                    <div className="hidden lg:block">{renderCalendar(1)}</div>
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="font-semibold mb-4 text-center">Available Times</h3>
                    {isLoadingTimeSlots ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {(() => {
                          const filtered = timeSlots.filter((time) => {
                            const today = new Date()
                            const isToday =
                              selectedDate.getDate() === today.getDate() &&
                              selectedDate.getMonth() === today.getMonth() &&
                              selectedDate.getFullYear() === today.getFullYear()

                            if (!isToday) return true

                            const [t, period] = time.split(" ")
                            let [hours, minutes] = t.split(":").map(Number)
                            if (period === "PM" && hours !== 12) hours += 12
                            if (period === "AM" && hours === 12) hours = 0

                            const slotDate = new Date(selectedDate)
                            slotDate.setHours(hours, minutes, 0, 0)

                            return slotDate > today
                          })

                          // Check if it's Sunday
                          const isSunday = selectedDate.getDay() === 0

                          if (isSunday || timeSlots.length === 0) {
                            return (
                              <div className="text-center w-full py-6 text-muted-foreground bg-muted/30 rounded-lg">
                                {isSunday ? (
                                  <>
                                    <p className="font-semibold text-red-600">🚫 Clinic Closed on Sunday</p>
                                    <p className="text-sm mt-1">We're open Monday-Friday (8 AM - 8 PM) and Saturday (9 AM - 5 PM)</p>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-semibold text-orange-600">No slots available for this date</p>
                                    <p className="text-sm mt-1">Please select another date</p>
                                  </>
                                )}
                              </div>
                            )
                          }

                          if (filtered.length === 0) {
                            return (
                              <div className="text-center w-full py-6 text-muted-foreground bg-muted/30 rounded-lg">
                                <p className="font-semibold text-orange-600">No slots available for today</p>
                                <p className="text-sm mt-1">Please select another date</p>
                              </div>
                            )
                          }

                          return filtered.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "px-6 py-3 rounded-lg font-medium transition-all",
                                selectedTime === time
                                  ? "bg-primary text-primary-foreground shadow-lg"
                                  : "bg-muted hover:bg-muted/80",
                              )}
                            >
                              {time}
                            </button>
                          ))
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Patient Information */}
            {currentStep === 4 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Your Details</h2>
                  <p className="text-muted-foreground">Please provide your contact information</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={patientInfo.fullName}
                      onChange={(e) => setPatientInfo({ ...patientInfo, fullName: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min="1"
                      max="120"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Confirm */}
            {currentStep === 5 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Review & Confirm</h2>
                  <p className="text-muted-foreground">Please review your appointment details</p>
                </div>
                <div className="space-y-4 bg-muted/50 rounded-xl p-6">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold">{selectedService}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Doctor</span>
                    <span className="font-semibold">{selectedDoctor}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Patient</span>
                    <span className="font-semibold">{patientInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold">{patientInfo.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold">{patientInfo.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep < 5 && (
                <Button onClick={handleNextStep} disabled={!canProceedToNextStep()} className="flex-1">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              {currentStep === 5 && (
                <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500">
                  Confirm Appointment
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
