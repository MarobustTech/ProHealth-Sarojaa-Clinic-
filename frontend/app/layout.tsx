import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://pro-health-sarojaa-clinic.vercel.app"),
  title: {
    default: "ProHealth Sarojaa Clinic - Book Your Medical Appointment Online",
    template: "%s | ProHealth Sarojaa Clinic",
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
  authors: [{ name: "ProHealth Sarojaa Clinic" }],
  creator: "ProHealth Sarojaa Clinic",
  publisher: "ProHealth Sarojaa Clinic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pro-health-sarojaa-clinic.vercel.app",
    siteName: "ProHealth Sarojaa Clinic",
    title: "ProHealth Sarojaa Clinic - Book Your Medical Appointment Online",
    description:
      "Professional healthcare services with experienced doctors. Book appointments online with instant confirmation. Quality medical care you can trust.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProHealth Sarojaa Clinic - Professional Healthcare Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProHealth Sarojaa Clinic - Book Your Medical Appointment Online",
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
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "ProHealth Sarojaa Clinic",
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
