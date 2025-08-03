'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface MarketingBannerProps {
  images: {
    url: string
    alt: string
    link?: string
  }[]
  autoPlayInterval?: number
  className?: string
}

const MarketingBanner = ({ 
  images, 
  autoPlayInterval = 5000,
  className = ''
}: MarketingBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [images.length, autoPlayInterval])

  // If no images, don't render anything
  if (!images || images.length === 0) {
    return null;
  }

  // If only one image, render it directly
  if (images.length === 1) {
    const image = images[0]
    return (
      <div className={`relative w-full h-[400px] md:h-[500px] overflow-hidden ${className}`}>
        {image.link ? (
          <a href={image.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-contain hover:scale-105 transition-transform duration-300"
              priority
            />
          </a>
        ) : (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-contain"
            priority
          />
        )}
      </div>
    )
  }

  // Otherwise, render slideshow
  return (
    <div className={`relative w-full h-[400px] md:h-[500px] overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {images[currentIndex].link ? (
            <a 
              href={images[currentIndex].link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
            </a>
          ) : (
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-contain"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-all z-20"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-all z-20"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}

export default MarketingBanner