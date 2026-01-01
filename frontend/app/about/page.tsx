import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, Award, Building2, Stethoscope, Shield, Clock, Target } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            About ProHealth Hospital
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            Caring for Your Health Since 1985
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            A leading healthcare institution committed to delivering exceptional medical care with compassion and
            excellence
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                Our Story
              </div>
              <h2 className="text-5xl font-bold mb-6 text-balance">Building Trust Through Quality Healthcare</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Founded in 1985, ProHealth Hospital has been at the forefront of providing exceptional medical care to
                our community for over three decades. What started as a small community clinic has grown into a
                comprehensive healthcare facility serving thousands of patients annually.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our commitment to medical excellence, patient-centered care, and continuous innovation has made us a
                trusted name in healthcare. We combine cutting-edge medical technology with compassionate care to ensure
                the best possible outcomes for our patients.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, ProHealth Hospital stands as a beacon of hope and healing, with a team of over 200 dedicated
                healthcare professionals working tirelessly to improve the lives of those we serve.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl blur-xl opacity-20" />
              <Image
                src="/modern-hospital-building-exterior-professional-pho.jpg"
                alt="ProHealth Hospital Building"
                width={600}
                height={600}
                className="relative rounded-2xl shadow-2xl border-4 border-white"
              />
            </div>
          </div>

          {/* Values Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">Our Core Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide every decision we make and every patient we serve
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Compassion</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Treating every patient with kindness, empathy, and respect
                  </p>
                </div>
              </Card>

              <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-teal-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Excellence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Delivering the highest quality medical care and services
                  </p>
                </div>
              </Card>

              <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Integrity</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Upholding ethical standards in all our practices
                  </p>
                </div>
              </Card>

              <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Innovation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Embracing new technologies and treatment methods
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-20">
            <Card className="p-12 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white relative overflow-hidden border-0 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-12 text-center">ProHealth by the Numbers</h2>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="text-5xl font-bold mb-2">200+</div>
                    <div className="text-lg opacity-90">Healthcare Professionals</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-4">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="text-5xl font-bold mb-2">50K+</div>
                    <div className="text-lg opacity-90">Patients Treated Annually</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-4">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="text-5xl font-bold mb-2">38+</div>
                    <div className="text-lg opacity-90">Years of Service</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-4">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div className="text-5xl font-bold mb-2">24/7</div>
                    <div className="text-lg opacity-90">Emergency Care Available</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-10 hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide accessible, high-quality healthcare services that improve the well-being of our community. We
                are dedicated to treating each patient with dignity, compassion, and respect while maintaining the
                highest standards of medical excellence.
              </p>
            </Card>

            <Card className="p-10 hover:shadow-2xl transition-all duration-300 border-2 hover:border-cyan-200">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To be recognized as the leading healthcare provider in our region, known for clinical excellence,
                innovative treatments, and compassionate care. We envision a healthier future where advanced medical
                care is accessible to all who need it.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-balance">Experience Excellence in Healthcare</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied patients who trust ProHealth Hospital for their healthcare needs
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            asChild
          >
            <Link href="/book">Book Your Appointment</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function Eye({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
