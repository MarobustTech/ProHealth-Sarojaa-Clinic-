import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, Stethoscope, Shield, Clock, Target, Smile, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { TechShowcase } from "@/components/tech-showcase"
import { SiteFooter } from "@/components/site-footer"
import { CurvedCarousel } from "@/components/curved-carousel"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section with Clinic Image */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-6 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                About Sree Sarojaa Multi Specialty Dental Clinic
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Trusted Dental Care Since 1998
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
                A trusted name in comprehensive dental care in Salem for over two decades, delivering high-quality, ethical, and patient-focused dental treatments
              </p>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/clinic/IMG_9715.jpg"
                alt="Sree Sarojaa Dental Clinic Exterior"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 md:mb-20">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
              Our Story
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Sree Sarojaa Multi Specialty Dental Clinic – Since 1998</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Established in 1998, Sree Sarojaa Multi Specialty Dental Clinic has been a trusted name in comprehensive dental care in Salem for over two decades. Located at the heart of the city near Vincent Bus Stop, Cherry Road, Kumaraswamypatti, our clinic has been dedicated to delivering high-quality, ethical, and patient-focused dental treatments.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              With a strong foundation built on experience, innovation, and compassion, we have successfully treated thousands of patients and families, helping them achieve healthy, confident smiles. Our long-standing presence is a reflection of the trust and satisfaction of our patients across generations.
            </p>
          </div>

          {/* Advanced Technology Section */}
          <div className="mb-16 md:mb-32">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block px-4 py-2 mb-6 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
                Our Technology
              </div>
              <h2 className="text-3xl md:text-4xl md:text-5xl font-bold mb-6 text-balance">World-Class Dental Technology</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We utilize the world&apos;s most advanced dental equipment to ensure precision, comfort, and the best possible outcomes for our patients.
              </p>
            </div>

            <TechShowcase
              items={[
                {
                  title: "Laser Technology",
                  subtitle: "by Dentsply Sirona",
                  description: "Experience pain-free dentistry with our advanced laser system. From gum contouring to infection control, laser technology ensures minimally invasive procedures, faster healing, and significantly reduced discomfort compared to traditional methods.",
                  image: "/tech/laser.png",
                  alt: "Dentsply Sirona Laser Technology"
                },
                {
                  title: "3D Intraoral Scanner",
                  subtitle: "by Shining 3D",
                  description: "Say goodbye to messy impression materials. Our state-of-the-art 3D scanner captures thousands of images per second to create a precise digital replica of your teeth, ensuring perfectly fitting crowns, bridges, and aligners.",
                  image: "/tech/scanner.jpg",
                  alt: "Shining 3D Intraoral Scanner"
                },
                {
                  title: "Invisible Aligners",
                  subtitle: "Clear Aligner Technology",
                  description: "Straighten your teeth discreetly with our premium invisible aligners. Custom-made for your unique smile, they offer a comfortable and virtually invisible alternative to traditional metal braces.",
                  image: "/tech/aligners.jpg",
                  alt: "Invisible Aligners Treatment"
                },
                {
                  title: "Premium Implants",
                  subtitle: "by Straumann",
                  description: "We use Straumann implants, the global gold standard in implant dentistry. Known for their exceptional reliability and rapid integration with bone, these implants provide a permanent, natural-looking solution for missing teeth.",
                  image: "/tech/implants.jpg",
                  alt: "Straumann Dental Implants"
                },
                {
                  title: "Intraoral Camera",
                  subtitle: "by Unicorn",
                  description: "See what we see. Our high-definition intraoral camera allows you to view the condition of your teeth in real-time on a screen, helping you understand your oral health and treatment needs better.",
                  image: "/tech/camera.jpg",
                  alt: "Unicorn Intraoral Camera"
                }
              ]}
            />
          </div>

          {/* Procedures Gallery - Curved Carousel */}
          <div className="mb-12 md:mb-20">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold">
              Our Work
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Excellence in Action</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Our experienced team of specialists performing advanced dental procedures with precision and care.
            </p>
            <CurvedCarousel
              images={[
                { src: "/clinic/IMG_9738.JPG", alt: "Dental procedure in progress" },
                { src: "/clinic/IMG_9744.jpg", alt: "Specialist performing treatment" },
                { src: "/clinic/IMG_9754.JPG", alt: "Advanced dental care" },
                { src: "/clinic/IMG_9772.jpg", alt: "Patient care excellence" },
                { src: "/clinic/IMG_9792.JPG", alt: "Modern dental treatment" },
              ]}
            />
          </div>

          {/* Our Philosophy */}
          <div className="mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Sree Sarojaa Multi Specialty Dental Clinic, we believe that every smile deserves expert care. Our approach combines:
            </p>
            <ul className="list-disc list-inside space-y-3 text-lg text-muted-foreground mb-6 ml-4">
              <li>Advanced dental technology</li>
              <li>Evidence-based treatment protocols</li>
              <li>Personalized patient care</li>
              <li>Strict sterilization and safety standards</li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We focus not just on treatment, but also on education, prevention, and long-term oral health.
            </p>
          </div>

          {/* Expert Team */}
          <div className="mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Expert Team of Specialists</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our clinic is proud to have a team of 12 highly qualified and experienced dental professionals, each specializing in different branches of dentistry. This multi-specialty approach allows us to provide complete dental solutions under one roof.
            </p>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Doctors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. K.P. Senthamarai Kannan</p>
                <p className="text-muted-foreground">MDS (Orthodontist), FPFA (USA)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. S. Vijayapriya</p>
                <p className="text-muted-foreground">BDS, FPFA (USA)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. J. Arunkumar</p>
                <p className="text-muted-foreground">MDS (Oral & Maxillofacial Surgeon)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. G. Rajkumar</p>
                <p className="text-muted-foreground">MDS (Prosthodontist)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. M. Jaikumar</p>
                <p className="text-muted-foreground">MDS (Endodontist)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. Basil Mathews</p>
                <p className="text-muted-foreground">MDS (Pedodontist)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. Anuradha</p>
                <p className="text-muted-foreground">MDS (Endodontist)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. V. T. Arun Varghese</p>
                <p className="text-muted-foreground">MDS (Periodontist)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. Shahid Basha</p>
                <p className="text-muted-foreground">BDS (Implantologist)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. Dhanakoti</p>
                <p className="text-muted-foreground">BDS</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. Manjula</p>
                <p className="text-muted-foreground">BDS</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-lg">Dr. Sri Hari</p>
                <p className="text-muted-foreground">BDS</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each doctor brings specialized expertise, ensuring accurate diagnosis, effective treatment, and excellent clinical outcomes.
            </p>
          </div>

          {/* Services */}
          <div className="mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Dental Services</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              As a true multi-specialty dental clinic, we offer a wide range of services including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">General & Preventive Dentistry</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Orthodontics (Braces & Aligners)</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Root Canal Treatment</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Dental Implants</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Oral & Maxillofacial Surgery</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Pediatric Dentistry</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Periodontal (Gum) Care</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Prosthodontics (Crowns, Bridges & Dentures)</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg">
                <p className="font-semibold">Cosmetic & Smile Dentistry</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <p className="font-semibold text-lg mb-2">Established since 1998</p>
                <p className="text-muted-foreground">Decades of trust and experience</p>
              </Card>
              <Card className="p-6">
                <p className="font-semibold text-lg mb-2">12 specialist doctors</p>
                <p className="text-muted-foreground">Under one roof</p>
              </Card>
              <Card className="p-6">
                <p className="font-semibold text-lg mb-2">Patient-friendly approach</p>
                <p className="text-muted-foreground">Ethical treatment approach</p>
              </Card>
              <Card className="p-6">
                <p className="font-semibold text-lg mb-2">Modern equipment</p>
                <p className="text-muted-foreground">Advanced techniques</p>
              </Card>
              <Card className="p-6">
                <p className="font-semibold text-lg mb-2">Convenient location</p>
                <p className="text-muted-foreground">In Salem</p>
              </Card>
              <Card className="p-6">
                <p className="font-semibold text-lg mb-2">Safe environment</p>
                <p className="text-muted-foreground">Comfortable, hygienic, and safe</p>
              </Card>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-24 px-4 md:px-6 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Experience Excellence in Dental Care</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied patients who trust Sree Sarojaa Multi Specialty Dental Clinic for their dental care needs
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
