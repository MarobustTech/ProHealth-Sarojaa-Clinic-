import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Calendar,
  MessageSquare,
  Users,
  Shield,
  Award,
  CheckCircle2,
  Star,
  ArrowRight,
  Stethoscope,
  Activity,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import CurvedLoop from "@/components/curved-loop"
import { BannerCarousel } from "@/components/banner-carousel"
async function getBanners() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/banners?status=active`, {
      cache: "no-store",
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Failed to fetch banners:", error)
  }
  return []
}

export default async function HomePage() {
  const banners = await getBanners()

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="pt-24">
        <BannerCarousel banners={banners} />
      </div>

      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg shadow-blue-500/10">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  Trusted by 150K+ Patients
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                Your Smile,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-xl text-pretty leading-relaxed">
                Experience world-class dental care with our team of expert dentists and state-of-the-art facilities.
                Quality treatment, personalized attention, beautiful smiles.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">12+ Dental Specialists</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md border border-gray-100">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">Award Winning Dental Care</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-md border border-gray-100">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Advanced Technology</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-500 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 text-base h-14 px-10 transition-all hover:scale-105"
                >
                  <Link href="/book">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-base h-14 px-10 bg-white hover:scale-105 transition-all shadow-md"
                >
                  <Link href="/services">View Services</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">Happy Smiles</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent mb-1">
                    12+
                  </div>
                  <div className="text-sm text-gray-600">Dental Specialists</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent mb-1">
                    20+
                  </div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
                <img
                  src="/professional-doctor-consulting-with-happy-family-i.jpg"
                  alt="Doctor consultation with happy family"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating stat card - top right */}
              <Card className="absolute -top-4 -right-4 p-6 bg-white shadow-2xl border-0 hover:scale-105 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      50K+
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Happy Smiles</div>
                  </div>
                </div>
              </Card>

              {/* Floating rating card - bottom left */}
              <Card className="absolute -bottom-4 -left-4 p-6 bg-white shadow-2xl border-0 hover:scale-105 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Star className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      4.9/5
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Patient Rating</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white py-8">
        <CurvedLoop
          marqueeText="Expert Dental Care • Modern Facilities • Your Smile • Our Priority"
          speed={1.5}
          curveAmount={150}
          className="fill-[#0ea5e9]"
        />
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white backdrop-blur-sm rounded-full mb-6 shadow-lg shadow-blue-500/10 border border-blue-100">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                Why Choose Sree Sarojaa
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-6 text-balance">
              Dental Care That{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                Puts You First
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
              Comprehensive dental services with cutting-edge technology and compassionate care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group p-8 border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Easy Booking</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Schedule appointments online in seconds. Choose your preferred doctor, date, and time slot with just a
                  few clicks.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="group p-8 border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-500 to-green-400 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Expert Dentists</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our team of highly qualified dental specialists brings decades of experience in orthodontics,
                  endodontics, prosthodontics, and more.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all"
                >
                  Meet Our Doctors <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="group p-8 border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Painless Treatments</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Advanced pain management techniques and gentle care to ensure your comfort throughout every procedure.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                >
                  Our Treatments <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="group p-8 border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Advanced Technology</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  State-of-the-art dental equipment including digital X-rays, 3D imaging, and laser dentistry for
                  precise treatments.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                >
                  Our Services <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="group p-8 border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-100 to-red-100 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-red-500 to-pink-400 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Compassionate Care</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We treat every patient with empathy, respect, and personalized attention to ensure comfort and
                  wellbeing.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:gap-3 transition-all"
                >
                  About Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            <Card className="group p-8 border-0 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full blur-3xl opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-400 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Quality Assured</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Accredited facilities with international standards. Multiple awards for excellence in patient care and
                  safety.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Start Your Smile Journey</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 text-balance">Ready to Experience Better Dental Care?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto text-pretty leading-relaxed">
            Book your appointment today and take the first step towards a healthier, brighter smile
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="h-14 px-10 text-base hover:scale-105 transition-all shadow-2xl font-semibold"
            >
              <Link href="/book">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-2 border-white text-white h-14 px-10 text-base hover:scale-105 transition-all font-semibold"
              asChild
            >
              <Link href="/contact">
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
