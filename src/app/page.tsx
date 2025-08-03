'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Projects from '@/components/Projects'
import TechStack from '@/components/TechStack'
import Products from '@/components/Products'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import MarketingBanner from '@/components/MarketingBanner'
// import NewYearCelebration from '@/components/NewYearCelebration'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
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
  const [marketingBanners, setMarketingBanners] = useState<BannerImage[]>([])

  useEffect(() => {
    const fetchMarketingBanners = async () => {
      try {
        const response = await fetch('/api/marketing');
        const result: MarketingBannerData = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // Filter active banners and map to the required format
          const activeBanners = result.data
            .filter(banner => banner.isActive)
            .map(banner => ({
              url: banner.imageUrl,
              alt: 'Marketing Banner',
              link: banner.link
            }));
          setMarketingBanners(activeBanners);
        }
      } catch (error) {
        console.error('Failed to fetch marketing banners:', error);
      }
    };

    fetchMarketingBanners();
  }, []);

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

          {/* Services Quick Preview */}
          <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
                <p className="text-xl text-gray-400 mb-8">
                  Comprehensive tech solutions tailored to your needs
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group"
                    >
                      <Link href="/services" className="block">
                        <div className="glass-effect p-6 rounded-xl border border-white/10 group-hover:border-purple-500/50 transition-all h-full">
                          <div className="text-3xl mb-4">{service.icon}</div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all">
                            {service.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4">
                            {service.description}
                          </p>
                          <div className="text-purple-400 font-semibold text-sm">
                            {service.price}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center px-8 py-3 mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  View All Services
                  <FiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Marketing Banner Section */}
          {marketingBanners.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Promotions</h2>
                  <p className="text-xl text-gray-400">
                    Check out our latest offers and special deals
                  </p>
                </div>
                <MarketingBanner 
                  images={marketingBanners}
                  autoPlayInterval={5000}
                />
              </motion.div>
            </div>
          )}

          <TechStack />
          <Products />
          <Projects />
          <Testimonials />
          <Footer />
        </div>
      </div>
    </main>
  )
} 