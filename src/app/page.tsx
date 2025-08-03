'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
// import NewYearCelebration from '@/components/NewYearCelebration'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import HotDeals from '@/components/HotDeals'
import TopPicks from '@/components/TopPicks'
import Platforms from '@/components/Platforms'
// import RepublicDayCelebration from '@/components/RepublicDayCelebration'

// Background Components
const GradientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
  </div>
)

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute inset-0" 
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(123,49,255,0.1) 1px, transparent 1px),
                         linear-gradient(rgba(123,49,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '4rem 4rem',
      }}
    />
  </div>
)

// Quick Services Preview
const services = [
  {
    icon: '🌐',
    name: 'Web Development',
    description: 'Custom web applications with modern frameworks.',
    price: 'From ₹15,000'
  },
  {
    icon: '📱',
    name: 'Mobile Apps',
    description: 'Native and cross-platform mobile solutions.',
    price: 'From ₹35,000'
  },
  {
    icon: '☁️',
    name: 'Cloud Solutions',
    description: 'Scalable infrastructure and DevOps services.',
    price: 'From ₹25,000'
  },
  {
    icon: '🎨',
    name: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces.',
    price: 'From ₹20,000'
  }
];

interface MarketingBannerData {
  success: boolean;
  data: {
    _id: string;
    imageUrl: string;
    link?: string;
    isActive: boolean;
  }[];
}

interface BannerImage {
  url: string;
  alt: string;
  link?: string;
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <main className="relative">
      {/* Background Elements */}
      <motion.div 
        className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(123,49,255,0.05)_0%,transparent_100%)]"
        style={{ y }}
      />
      <GradientOrbs />
      <GridBackground />
      
      {/* Republic Day Celebration */}
      {/* <RepublicDayCelebration /> */}
      
      {/* Content */}
      <div className="relative">
        <Navbar />
        <div className="relative">
          <Hero />

          {/* <TechStack /> */}
          {/* <Products /> */}
          {/* <Projects /> */}
          <HotDeals />
          <TopPicks />
          <Platforms />
          <Testimonials />
          <Footer />
        </div>
      </div>
    </main>
  )
} 