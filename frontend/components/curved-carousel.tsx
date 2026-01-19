"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CurvedCarouselProps {
    images: {
        src: string
        alt: string
    }[]
}

export function CurvedCarousel({ images }: CurvedCarouselProps) {
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [isAutoScrolling, setIsAutoScrolling] = useState(true)

    // Auto-scroll effect
    useEffect(() => {
        if (!isAutoScrolling || !scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const scrollSpeed = 1 // pixels per frame
        let animationFrameId: number

        const autoScroll = () => {
            if (container) {
                // Scroll to the right
                container.scrollLeft += scrollSpeed

                // Check if we've reached the end
                const maxScroll = container.scrollWidth - container.clientWidth
                if (container.scrollLeft >= maxScroll) {
                    // Reset to beginning for infinite loop
                    container.scrollLeft = 0
                }
            }
            animationFrameId = requestAnimationFrame(autoScroll)
        }

        animationFrameId = requestAnimationFrame(autoScroll)

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [isAutoScrolling])

    const scroll = (direction: 'left' | 'right') => {
        setIsAutoScrolling(false) // Pause auto-scroll when user interacts
        if (scrollContainerRef.current) {
            const scrollAmount = 400
            const newPosition = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount

            scrollContainerRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            })

            // Resume auto-scroll after 3 seconds
            setTimeout(() => setIsAutoScrolling(true), 3000)
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsAutoScrolling(false) // Pause auto-scroll when dragging
        setIsDragging(true)
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 2
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        // Resume auto-scroll after 3 seconds
        setTimeout(() => setIsAutoScrolling(true), 3000)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setScrollPosition(scrollContainerRef.current.scrollLeft)
            }
        }

        const container = scrollContainerRef.current
        container?.addEventListener('scroll', handleScroll)
        return () => container?.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="relative w-full">
            {/* Carousel container */}
            <div className="relative px-4 md:px-12 py-8">
                {/* Left gradient fade */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

                {/* Right gradient fade */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Scrollable container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        perspective: '1000px',
                        perspectiveOrigin: 'center center'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseEnter={() => setIsAutoScrolling(false)} // Pause on hover
                    onMouseOut={() => setTimeout(() => setIsAutoScrolling(true), 1000)} // Resume after leaving
                >
                    {/* Duplicate images for seamless loop */}
                    {[...images, ...images].map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 relative group w-[260px] h-[340px] md:w-[320px] md:h-[400px]"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                    draggable={false}
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    )
}
