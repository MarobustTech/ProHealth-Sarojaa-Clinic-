import Link from "next/link"
import { Heart, Mail, Phone, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                ProHealth
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Providing quality healthcare services with compassion and excellence since 2005.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>
                  SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC
                  <br />
                  Near Vincent Bus Stop, Cherry Road
                  <br />
                  Kumaraswamypatti, Salem - 636007
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>0427 2313339 / 8946088182</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Contact via phone</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Office Hours</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Monday - Friday: 8:00 AM - 8:00 PM</li>
              <li>Saturday: 9:00 AM - 5:00 PM</li>
              <li>Sunday: Closed</li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  Emergency: 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; 2025{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              ProHealth
            </span>{" "}
            Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
