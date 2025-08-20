'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Background Components
const GradientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
  </div>
)

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px),
                         linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px)`,
        backgroundSize: '4rem 4rem',
      }}
    />
  </div>
)

// Offers Data
const offersData = [
  // {
  //   id: 1,
  //   title: "New Year Special",
  //   subtitle: "Start 2024 with a Digital Transformation",
  //   description: "Get up to 40% off on all marketplace products. Perfect time to launch your online business with our premium software solutions. Limited time offer - don't miss out!",
  //   image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop&crop=center",
  //   url: "/marketplace",
  //   buttonText: "Shop Now",
  //   badge: "40% OFF",
  //   badgeColor: "from-red-500 to-pink-500"
  // },
  {
    id: 2,
    title: "Freelancer Bundle",
    subtitle: "Everything You Need to Scale",
    description: "Complete package for freelancers and agencies. Includes portfolio website, client management system, and invoicing tools. Boost your productivity and professional image.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=center",
    url: "/marketplace",
    buttonText: "Get Bundle",
    badge: "BUNDLE",
    badgeColor: "from-purple-500 to-indigo-500"
  },
  {
    id: 3,
    title: "E-Commerce Launch",
    subtitle: "Turn Your Ideas into Sales",
    description: "Complete e-commerce solution with payment processing, inventory management, and marketing tools. Launch your online store in days, not months.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center",
    url: "/marketplace",
    buttonText: "Launch Store",
    badge: "HOT",
    badgeColor: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Custom Development",
    subtitle: "Tailored Solutions for Your Business",
    description: "Need something unique? Our custom development service creates tailored solutions that perfectly fit your business requirements. From concept to deployment.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop&crop=center",
    url: "https://digicraft.one",
    buttonText: "Get Quote",
    badge: "CUSTOM",
    badgeColor: "from-teal-500 to-blue-500"
  },
  {
    id: 5,
    title: "Agency Partnership",
    subtitle: "Reseller Program for Agencies",
    description: "Join our reseller program and earn commissions on every sale. Perfect for web agencies, freelancers, and digital marketers. White-label solutions available.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center",
    url: "mailto:partnership@digicraft.one",
    buttonText: "Join Program",
    badge: "PARTNER",
    badgeColor: "from-green-500 to-emerald-500"
  }
]

interface OfferCardProps {
  offer: typeof offersData[0]
  isReversed: boolean
  index: number
}

const OfferCard = ({ offer, isReversed, index }: OfferCardProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="py-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          isReversed ? 'lg:grid-flow-col-dense' : ''
        }`}>
          
          {/* Image Section */}
          <div className={`relative ${isReversed ? 'lg:col-start-2' : ''}`}>
            <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20" />
              
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-block bg-gradient-to-r ${offer.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                  {offer.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`space-y-6 ${isReversed ? 'lg:col-start-1' : ''}`}>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {offer.title}
              </h2>
              <h3 className="text-xl lg:text-2xl text-teal-400 font-semibold mb-4">
                {offer.subtitle}
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={offer.url}
                className={`inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-all ${
                  offer.url.includes('digicraft.one') || offer.url.includes('mailto')
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-slate-800/50 text-white border border-teal-500/30 hover:border-teal-500/60 hover:bg-slate-700/50'
                }`}
              >
                {offer.buttonText}
              </Link>
              
              {offer.url.includes('mailto') && (
                <span className="text-sm text-gray-400 flex items-center">
                  Direct email contact
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default function OffersPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <main className="relative">
      {/* Background Elements */}
      <motion.div
        className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]"
        style={{ y }}
      />
      <GradientOrbs />
      <GridBackground />

      {/* Content */}
      <div className="relative">
        <Navbar />

        {/* Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Special Offers
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Discover exclusive deals and limited-time offers on our premium software solutions. 
                From special discounts to custom development packages, we have something for every business need.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Offers */}
        <div className="space-y-8">
          {offersData.map((offer, index) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isReversed={index % 2 === 1}
              index={index}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Choose the perfect offer for your business and start your digital transformation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Browse Marketplace
                </Link>
                <Link
                  href="https://digicraft.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-800/50 text-white border border-teal-500/30 font-semibold rounded-full hover:border-teal-500/60 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <Footer />
      </div>
    </main>
  )
}