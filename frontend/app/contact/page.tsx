import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, MapPin, Mail, Clock, MessageSquare } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            We're Here to Help
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            We're here to help! Reach out to us through phone or our instant chatbot support
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Phone</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Call us during business hours for appointments and inquiries
                </p>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-primary">0427 2313339</p>
                  <p className="text-xl font-bold text-primary">8946088182</p>
                </div>
              </div>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-teal-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Email</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Send us an email and we'll respond within 24 hours
                </p>
                <p className="text-lg font-medium text-primary">Contact us via phone for inquiries</p>
              </div>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-cyan-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Address</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">Visit us at our clinic location</p>
                <p className="text-lg font-medium">
                  SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC
                  <br />
                  NEAR VINCENT BUS STOP,
                  <br />
                  CHERRY ROAD, KUMARASWAMYPATTI
                  <br />
                  SALEM - 636007
                </p>
              </div>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Hours</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">Our hospital is open throughout the week</p>
                <ul className="space-y-1 font-medium">
                  <li>Mon - Fri: 8:00 AM - 8:00 PM</li>
                  <li>Saturday: 9:00 AM - 5:00 PM</li>
                  <li>Sunday: Closed</li>
                  <li className="pt-2 text-primary font-bold">Emergency: 24/7</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Hospital Location Map */}
          <Card className="p-8 mb-12 border-2 hover:border-blue-200 transition-colors shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Find Us Here</h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Visit our clinic at SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC, Near Vincent Bus Stop, Cherry Road, Kumaraswamypatti, Salem - 636007
            </p>
            <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
              <iframe
                src="https://www.google.com/maps?q=SREE+SAROJAA+MULTI+SPECIALTY+DENTAL+CLINIC,+Cherry+Road,+Kumaraswamypatti,+Salem,+Tamil+Nadu+636007&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC Location"
              />
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Getting Here:</strong> Located near Vincent Bus Stop on Cherry Road, Kumaraswamypatti, Salem. Easily accessible by public transport.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <a 
                  href="https://maps.app.goo.gl/kSZG5kJjMN8XUCsR7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Google Maps →
                </a>
              </p>
            </div>
          </Card>

          {/* Chatbot Support */}
          <Card className="p-10 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white relative overflow-hidden border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />

            <div className="max-w-2xl mx-auto text-center relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Need Instant Support?</h2>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                If our phone line is busy or unanswered, please continue via our chatbot for instant support. Our AI
                assistant is available 24/7 to help you with appointments, questions, and general inquiries.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                asChild
              >
                <Link href="https://t.me/TheMedixBot" target="_blank">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with Hospital Assistant
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
