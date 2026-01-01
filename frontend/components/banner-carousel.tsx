"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Banner {
  _id?: string
  id?: string | number
  title: string
  description: string
  image: string
  buttonText?: string
  buttonLink?: string
  isActive: boolean
}

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const activeBanners = banners.filter((banner) => banner.isActive)

  useEffect(() => {
    if (activeBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [activeBanners.length])

  if (activeBanners.length === 0) return null

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }

  return (
    <section className="relative h-[500px] bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Banners */}
      <div className="relative h-full">
        {activeBanners.map((banner, index) => (
          <div
            key={banner._id || banner.id || `banner-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="container mx-auto max-w-7xl h-full px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                {/* Text Content */}
                <div className="space-y-6 z-10">
                  <h2 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                    {banner.title.split(" ").map((word, i) =>
                      i % 3 === 1 ? (
                        <span
                          key={i}
                          className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent"
                        >
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      ),
                    )}
                  </h2>
                  <p className="text-xl text-gray-600 text-pretty leading-relaxed">{banner.description}</p>
                  {banner.buttonText && banner.buttonLink && (
                    <Button
                      size="lg"
                      asChild
                      className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-500 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 text-base h-14 px-8 transition-all hover:scale-105"
                    >
                      <a href={banner.buttonLink}>{banner.buttonText}</a>
                    </Button>
                  )}
                </div>

                {/* Image */}
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {activeBanners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white h-12 w-12 rounded-full shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white h-12 w-12 rounded-full shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-blue-600" : "w-2 bg-gray-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
