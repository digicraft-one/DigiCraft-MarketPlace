"use client";
import {
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface HotDealCardProps {
  product: Product
  index: number
}

const HotDealCard = ({ product, index }: HotDealCardProps) => {
  // Get base pricing option
  const basePricing = product.pricingOptions.find(option => option.label === 'base')
  const basePrice = basePricing?.price || 0
  const discountPercentage = basePricing?.discountPercentage || 0
  
  // Calculate discounted price
  const discountedPrice = basePrice - (basePrice * discountPercentage / 100)
  
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20">
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          {/* <FireIcon className="w-4 h-4" /> */}
          {discountPercentage}% OFF
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
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-white">
            ₹{Math.round(discountedPrice).toLocaleString()}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ₹{Math.round(basePrice).toLocaleString()}
          </span>
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
          href={`/marketplace/${product._id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg transition-all w-full justify-center">
          Get This Deal
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

const HotDeals = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        const data = await response.json()
        
        if (data.success) {
          // Filter products that have base pricing with discounts
          const productsWithDiscounts = data.data.filter((product: Product) => {
            const basePricing = product.pricingOptions.find(option => option.label === 'base')
            return basePricing && basePricing.discountPercentage && basePricing.discountPercentage > 0
          })
          
          // Sort by discount percentage (highest first) and take top 3
          const topDeals = productsWithDiscounts
            .sort((a: Product, b: Product) => {
              const aDiscount = a.pricingOptions.find(option => option.label === 'base')?.discountPercentage || 0
              const bDiscount = b.pricingOptions.find(option => option.label === 'base')?.discountPercentage || 0
              return bDiscount - aDiscount
            })
            .slice(0, 3)
          
          setProducts(topDeals)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to fetch hot deals')
        console.error('Error fetching hot deals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHotDeals()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* <FireIcon className="w-8 h-8 text-red-500" /> */}
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Hot Deals
              </h2>
              {/* <FireIcon className="w-8 h-8 text-red-500" /> */}
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Loading limited time offers on our most popular pre-built websites...
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

  // If no products with discounts found
  if (products.length === 0) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* <FireIcon className="w-8 h-8 text-red-500" /> */}
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Hot Deals
            </h2>
            {/* <FireIcon className="w-8 h-8 text-red-500" /> */}
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            No hot deals available at the moment. Check back soon for amazing discounts!
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all">
            View All Products
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
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
          className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* <FireIcon className="w-8 h-8 text-red-500" /> */}
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Hot Deals
            </h2>
            {/* <FireIcon className="w-8 h-8 text-red-500" /> */}
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Limited time offers on our most popular pre-built
            websites. Don&apos;t miss out on these incredible discounts!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <HotDealCard key={product._id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all">
            View All Products
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HotDeals;
