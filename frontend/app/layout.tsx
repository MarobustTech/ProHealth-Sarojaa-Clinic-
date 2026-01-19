import type React from "react"
import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://pro-health-sarojaa-clinic.vercel.app"),
  title: {
    default: "Sree Sarojaa Dental Clinic - Book Your Dental Appointment Online",
    template: "%s | Sree Sarojaa Dental Clinic",
  },
  description:
    "Professional healthcare services with experienced doctors and easy online appointment booking. Book appointments with specialists in Orthodontics, Endodontics, Prosthodontics, and more. Quality medical care with instant confirmation.",
  keywords: [
    "hospital appointment booking",
    "online doctor consultation",
    "medical clinic",
    "healthcare appointments",
    "book doctor appointment",
    "dental clinic",
    "orthodontist",
    "endodontist",
    "prosthodontist",
    "medical specialists",
  ],
  authors: [{ name: "Sree Sarojaa Dental Clinic" }],
  creator: "Sree Sarojaa Dental Clinic",
  publisher: "Sree Sarojaa Dental Clinic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pro-health-sarojaa-clinic.vercel.app",
    siteName: "Sree Sarojaa Dental Clinic",
    title: "Sree Sarojaa Dental Clinic - Book Your Dental Appointment Online",
    description:
      "Professional healthcare services with experienced doctors. Book appointments online with instant confirmation. Quality medical care you can trust.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sree Sarojaa Dental Clinic - Professional Dental Care Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sree Sarojaa Dental Clinic - Book Your Dental Appointment Online",
    description:
      "Professional healthcare services with experienced doctors. Book appointments online with instant confirmation.",
    images: ["/og-image.png"],
    creator: "@prohealthclinic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "eHTbWynJr9TPcM2Iy2fTgCRcpFCRy9XOb7Mb8unbXQA",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Sree Sarojaa Dental Clinic",
    url: "https://pro-health-sarojaa-clinic.vercel.app",
    logo: "https://pro-health-sarojaa-clinic.vercel.app/logo.png",
    description:
      "Professional healthcare services with experienced doctors and easy online appointment booking. Quality medical care with instant confirmation.",
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
