"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Award, GraduationCap, ChevronRight, ChevronDown, Stethoscope, Smile, Activity, Baby, Hammer, HeartPulse, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
// Import custom scalpel icon if needed or map to scissors as fallback
import { Scissors as Scalpel } from "lucide-react"

// Icon mapping
const iconMap: Record<string, any> = {
    tooth: Stethoscope,
    braces: Smile,
    root: Activity,
    child: Baby,
    surgery: Scalpel,
    implant: Hammer,
    activity: HeartPulse,
    screw: Settings,
    default: Stethoscope
}

interface Doctor {
    id: string
    name: string
    specialization: string
    experience: string | number
    qualification: string
    consultationFee?: number
    // Removed profilePicture requirement as valid prop but ignored in UI
}

interface Service {
    _id?: string
    id?: string
    name: string
    description: string
    icon: string
    doctors: Doctor[]
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const IconComponent = iconMap[service.icon] || iconMap.default

    return (
        <div
            className="group"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
        >
            {/* Service Header - Clickable */}
            <Card
                className={cn(
                    "p-8 transition-all duration-300 border-2 relative overflow-hidden mb-4 cursor-pointer",
                    isExpanded ? "border-primary shadow-lg bg-blue-50/50" : "hover:shadow-xl hover:border-primary/20"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                    <div className="flex items-center gap-6">
                        {/* Icon Box */}
                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md flex-shrink-0",
                            isExpanded ? "bg-primary text-white scale-110" : "bg-white text-primary border border-blue-100 group-hover:scale-105"
                        )}>
                            <IconComponent className="w-8 h-8" />
                        </div>

                        {/* Service Info */}
                        <div className="flex-1">
                            <h3 className={cn(
                                "text-2xl font-bold mb-1 transition-colors",
                                isExpanded ? "text-primary" : "group-hover:text-primary"
                            )}>
                                {service.name}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                        </div>

                        {/* Arrow */}
                        <div className="text-primary/50">
                            {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Collapsible Doctors List */}
            <div
                className={cn(
                    "grid md:grid-cols-2 gap-4 ml-6 pl-8 border-l-2 border-primary/10 overflow-hidden transition-all duration-500 ease-in-out",
                    isExpanded ? "max-h-[1000px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
                )}
            >
                {service.doctors.map((doctor: any, doctorIndex: number) => (
                    <Card
                        key={doctor._id || doctor.id || `doctor-${index}-${doctorIndex}`}
                        className="p-5 hover:shadow-md transition-all duration-300 bg-white/80 border hover:border-primary/30"
                    >
                        <div className="flex flex-col gap-2">
                            <h4 className="text-lg font-bold text-gray-900">{doctor.name}</h4>
                            <p className="text-primary font-medium text-sm -mt-1">{doctor.specialization}</p>

                            <div className="mt-2 text-sm text-gray-500 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Award className="w-3 h-3 text-primary" />
                                    <span>{doctor.experience}+ years experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-3 h-3 text-primary" />
                                    <span>{doctor.qualification}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
