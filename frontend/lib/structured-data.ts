// Structured Data (JSON-LD) utilities for SEO

export interface OrganizationSchema {
    "@context": "https://schema.org"
    "@type": "MedicalBusiness" | "Organization"
    name: string
    url: string
    logo?: string
    description?: string
    telephone?: string
    address?: {
        "@type": "PostalAddress"
        streetAddress?: string
        addressLocality?: string
        addressRegion?: string
        postalCode?: string
        addressCountry?: string
    }
    sameAs?: string[]
}

export function getOrganizationSchema(): OrganizationSchema {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        name: "Sree Sarojaa Dental Clinic",
        url: "https://pro-health-sarojaa-clinic.vercel.app",
        logo: "https://pro-health-sarojaa-clinic.vercel.app/logo.png",
        description: "Professional healthcare services with experienced doctors and easy online appointment booking. Quality medical care with instant confirmation.",
        telephone: "+91-XXX-XXX-XXXX", // Update with actual phone
        address: {
            "@type": "PostalAddress",
            addressLocality: "Your City",
            addressRegion: "Your State",
            addressCountry: "IN",
        },
    }
}

export function getLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        name: "Sree Sarojaa Dental Clinic",
        image: "https://pro-health-sarojaa-clinic.vercel.app/logo.png",
        "@id": "https://pro-health-sarojaa-clinic.vercel.app",
        url: "https://pro-health-sarojaa-clinic.vercel.app",
        telephone: "+91-XXX-XXX-XXXX",
        priceRange: "$$",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Your Street Address",
            addressLocality: "Your City",
            addressRegion: "Your State",
            postalCode: "XXXXXX",
            addressCountry: "IN",
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
            },
        ],
    }
}

export function getWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Sree Sarojaa Dental Clinic",
        url: "https://pro-health-sarojaa-clinic.vercel.app",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://pro-health-sarojaa-clinic.vercel.app/book?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    }
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}
