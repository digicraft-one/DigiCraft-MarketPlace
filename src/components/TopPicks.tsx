'use client'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Product IDs for Top Picks
const TOP_PICK_IDS = [
  '68935c9919c4735a739f6821', // Modern E-Commerce Hub
  '689374024b99ab8ec5eb2dd0', // Creative Portfolio Pro
  '6893810f4b99ab8ec5eb2de9'  // Business Landing Page
]

interface ProductFeature {
  imageUrl: string
  imagePublicId: string
  title: string
  description: string
}

interface PricingTier {
  label: 'base' | 'plus' | 'pro' | 'ultimate'
  price: number
  discountPercentage?: number
}

interface Product {
  _id: string
  title: string
  shortDescription: string
  longDescription: string
  coverImage: { url: string; publicId: string }
  deliverables: string[]
  category: 'ecommerce' | 'portfolio' | 'blog' | 'landing' | 'custom'
  features: ProductFeature[]
  pricingOptions: PricingTier[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface TopPickCardProps {
  product: Product
  index: number
}

const TopPickCard = ({ product, index }: TopPickCardProps) => {
  // Get base price (first pricing option)
  const basePrice = product.pricingOptions.find(option => option.label === 'base')?.price || 0
  // const priceInINR = Math.round(basePrice * 83) // Approximate USD to INR conversion

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'ecommerce': 'E-commerce',
      'portfolio': 'Portfolio',
      'blog': 'Blog',
      'landing': 'Business',
      'custom': 'Custom'
    }
    return categoryMap[category] || category
  }

  // Get badge based on category
  const getBadge = (category: string) => {
    const badgeMap: Record<string, string> = {
      'ecommerce': 'Best Seller',
      'portfolio': "Editor's Choice",
      'blog': 'Popular',
      'landing': 'Popular',
      'custom': 'Premium'
    }
    return badgeMap[category] || 'Featured'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20"
    >
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {getBadge(product.category)}
        </div>
      </div>

      <div className="p-6">
        <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
          <Image
            src={product.coverImage.url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 bg-gradient-to-tr from-teal-500/30 to-blue-500/30 aspect-video"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-500 opacity-20" /> */}
        </div>

        <div className="mb-4">
          <span className="text-sm text-teal-400 font-medium">
            {getCategoryDisplayName(product.category)}
          </span>
          <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">₹{basePrice.toLocaleString()}</span>
          <span className="text-sm text-gray-400 ml-2">Starting from</span>
        </div>

        <div className="space-y-2 mb-6">
          {product.deliverables.slice(0, 5).map((deliverable, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" />
              <span className="text-sm text-gray-400">{deliverable}</span>
            </div>
          ))}
        </div>

        <Link
          href={`/products/${product._id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg transition-all w-full justify-center"
        >
          View Details
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}

const TopPicks = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        setLoading(true)
        const productPromises = TOP_PICK_IDS.map(id => 
          fetch(`/api/products/${id}`).then(res => res.json())
        )
        
        const responses = await Promise.all(productPromises)
        const fetchedProducts = responses
          .filter(response => response.success)
          .map(response => response.data)
        
        setProducts(fetchedProducts)
      } catch (err) {
        setError('Failed to fetch top picks')
        console.error('Error fetching top picks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopPicks()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* <StarIcon className="w-8 h-8 text-yellow-500 fill-current" /> */}
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Top Picks
              </h2>
              {/* <StarIcon className="w-8 h-8 text-yellow-500 fill-current" /> */}
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Loading our most popular and highly-rated pre-built websites...
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-700 rounded-xl mb-6"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-6"></div>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-3 bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="text-red-400 mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

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
            {/* <StarIcon className="w-8 h-8 text-yellow-500 fill-current" /> */}
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Top Picks
            </h2>
            {/* <StarIcon className="w-8 h-8 text-yellow-500 fill-current" /> */}
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our most popular and highly-rated pre-built websites.
            Trusted by thousands of satisfied customers worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <TopPickCard key={product._id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
          >
            View All Products
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default TopPicks 