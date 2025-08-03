'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline'

const topPicks = [
  {
    id: 1,
    title: "Modern E-Commerce Hub",
    price: 399,
    image: "/products/color-picker.png",
    rating: 4.9,
    reviews: 127,
    views: 2340,
    features: [
      "Advanced Product Catalog",
      "Multi-Payment Options",
      "Inventory Management",
      "Customer Analytics",
      "Mobile-First Design"
    ],
    category: "E-commerce",
    badge: "Best Seller"
  },
  {
    id: 2,
    title: "Creative Portfolio Pro",
    price: 299,
    image: "/products/excela.webp",
    rating: 4.8,
    reviews: 89,
    views: 1890,
    features: [
      "Portfolio Showcase",
      "Blog Integration",
      "Contact Management",
      "Social Media Integration",
      "Custom Animations"
    ],
    category: "Portfolio",
    badge: "Editor's Choice"
  },
  {
    id: 3,
    title: "Business Landing Page",
    price: 249,
    image: "/products/color-picker.png",
    rating: 4.7,
    reviews: 156,
    views: 3120,
    features: [
      "Lead Generation Forms",
      "Service Showcase",
      "Testimonials Section",
      "Call-to-Action Buttons",
      "SEO Optimized"
    ],
    category: "Business",
    badge: "Popular"
  }
]

interface TopPickCardProps {
  title: string
  price: number
  image: string
  rating: number
  reviews: number
  views: number
  features: string[]
  category: string
  badge: string
  index: number
}

const TopPickCard = ({ title, price, image, rating, reviews, views, features, category, badge, index }: TopPickCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20"
  >
    {/* Badge */}
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
        {badge}
      </div>
    </div>

    <div className="p-6">
      <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-500 opacity-20" />
      </div>
      
      <div className="mb-4">
        <span className="text-sm text-teal-400 font-medium">{category}</span>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      </div>

      {/* Rating and Views */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-white font-semibold">{rating}</span>
          </div>
          <span className="text-gray-400 text-sm">({reviews} reviews)</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <EyeIcon className="w-4 h-4" />
          <span>{views}</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-white">${price}</span>
      </div>
      
      <div className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" />
            <span className="text-sm text-gray-400">{feature}</span>
          </div>
        ))}
      </div>
      
      <Link 
        href={`/top-pick/${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg transition-all w-full justify-center"
      >
        View Details
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
)

const TopPicks = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <StarIcon className="w-8 h-8 text-yellow-500 fill-current" />
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Top Picks
            </h2>
            <StarIcon className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our most popular and highly-rated pre-built websites. 
            Trusted by thousands of satisfied customers worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPicks.map((pick, index) => (
            <TopPickCard key={pick.id} {...pick} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            href="/top-picks" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
          >
            View All Top Picks
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default TopPicks 