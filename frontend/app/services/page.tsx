import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ServiceCard } from "@/components/service-card"
async function getServices() {
  try {
    const [doctorsRes, specializationsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/doctors?active_only=true`, { cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/specializations?active_only=true`, {
        cache: "no-store",
      }),
    ])

    if (doctorsRes.ok && specializationsRes.ok) {
      const doctors = await doctorsRes.json()
      const specializations = await specializationsRes.json()
      return {
        doctors: doctors.filter((d: any) => d.isActive),
        specializations: specializations.filter((s: any) => s.isActive),
      }
    }
  } catch (error) {
    console.error("Failed to fetch services:", error)
  }

  // Return empty arrays if API fails
  return {
    doctors: [],
    specializations: [],
  }
}

function groupDoctorsBySpecialization(doctors: any[], specializations: any[]) {
  return specializations.map((spec) => ({
    ...spec,
    doctors: doctors.filter((doc) => doc.specialization === spec.name),
  }))
}

export default async function ServicesPage() {
  const { doctors, specializations } = await getServices()
  const servicesWithDoctors = groupDoctorsBySpecialization(doctors, specializations)

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden">
        {/* ... (Hero content same as before) */}
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Expert Medical Services
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            Our Medical Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Comprehensive healthcare services delivered by experienced professionals across multiple specialties
          </p>
        </div>
      </section>

      {/* Services Grid with Doctors */}
      <section className="py-20 px-6 bg-white relative">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6">
            {servicesWithDoctors.map((service, index) => {
              if (service.doctors.length === 0) return null
              return <ServiceCard key={service._id || service.id || `service-${index}`} service={service} index={index} />
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-balance">Need Medical Assistance?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Book an appointment with our specialists and get the care you deserve
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            asChild
          >
            <Link href="/book">Book Appointment Now</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
