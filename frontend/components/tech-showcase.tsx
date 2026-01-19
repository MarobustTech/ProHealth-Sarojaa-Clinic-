"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TechItem {
    title: string
    subtitle: string
    description: string
    image: string
    alt: string
}

interface TechShowcaseProps {
    items: TechItem[]
}

export function TechShowcase({ items }: TechShowcaseProps) {
    return (
        <div className="space-y-24">
            {items.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={cn(
                        "flex flex-col gap-8 md:gap-16 items-center",
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                >
                    {/* Text Content */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm">
                            Advanced Technology
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                            {item.title}
                        </h3>
                        <p className="text-xl text-blue-600 font-medium">
                            {item.subtitle}
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {item.description}
                        </p>
                    </div>

                    {/* Image Content */}
                    <div className="flex-1 w-full">
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <Image
                                src={item.image}
                                alt={item.alt}
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
