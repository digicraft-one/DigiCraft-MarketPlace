'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    StarIcon,
    EyeIcon,
    ShoppingCartIcon,
    HeartIcon,
    ArrowRightIcon,
    FireIcon,
    ClockIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import type { CategoryType, PricingTier, ProductFeature, Plans } from '@/types/schemas'
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

// Dummy data according to Product schema
const dummyProducts = [
    {
        _id: '1',
        title: "E-Commerce Store Pro",
        shortDescription: "Complete e-commerce solution with advanced features",
        longDescription: "A comprehensive e-commerce platform with product management, payment processing, inventory tracking, and customer analytics. Perfect for online businesses looking to scale.",
        coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&crop=center",
        deliverables: [
            "Complete website files",
            "Database setup guide",
            "Payment gateway integration",
            "SEO optimization",
            "Mobile responsive design",
            "Admin dashboard"
        ],
        category: "ecommerce" as CategoryType,
        features: [
            {
                imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&crop=center",
                title: "Product Management",
                description: "Easy product catalog management with categories and variants"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
                title: "Payment Processing",
                description: "Secure payment gateway integration with multiple payment options"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center",
                title: "Inventory Tracking",
                description: "Real-time inventory management with low stock alerts"
            }
        ],
        pricingOptions: [
            { label: "base" as Plans, price: 299, discountPercentage: 0 },
            { label: "plus" as Plans, price: 499, discountPercentage: 10 },
            { label: "pro" as Plans, price: 799, discountPercentage: 20 },
            { label: "ultimate" as Plans, price: 1299, discountPercentage: 25 }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        rating: 4.9,
        reviews: 127,
        views: 2340,
        isHotDeal: true,
        timeLeft: "2 days left"
    },
    {
        _id: '2',
        title: "Portfolio Showcase",
        shortDescription: "Professional portfolio website for creatives",
        longDescription: "A stunning portfolio website designed for creative professionals, artists, and freelancers. Features gallery management, blog integration, and contact forms.",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&crop=center",
        deliverables: [
            "Portfolio website",
            "Gallery management system",
            "Blog integration",
            "Contact forms",
            "Social media integration",
            "SEO optimization"
        ],
        category: "portfolio" as CategoryType,
        features: [
            {
                imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&crop=center",
                title: "Gallery Management",
                description: "Organize and showcase your work with beautiful galleries"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop&crop=center",
                title: "Blog Integration",
                description: "Share your thoughts and updates with integrated blogging"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop&crop=center",
                title: "Contact Forms",
                description: "Professional contact forms with spam protection"
            }
        ],
        pricingOptions: [
            { label: "base" as Plans, price: 199, discountPercentage: 0 },
            { label: "plus" as Plans, price: 349, discountPercentage: 15 },
            { label: "pro" as Plans, price: 549, discountPercentage: 25 },
            { label: "ultimate" as Plans, price: 899, discountPercentage: 30 }
        ],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        rating: 4.8,
        reviews: 89,
        views: 1890,
        isHotDeal: false
    },
    {
        _id: '3',
        title: "Business Landing Page",
        shortDescription: "High-converting landing page for businesses",
        longDescription: "A professional landing page designed to convert visitors into customers. Includes lead generation forms, service showcases, and testimonials sections.",
        coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop&crop=center",
        deliverables: [
            "Landing page design",
            "Lead generation forms",
            "Service showcase sections",
            "Testimonials integration",
            "Analytics setup",
            "A/B testing tools"
        ],
        category: "landing" as CategoryType,
        features: [
            {
                imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop&crop=center",
                title: "Lead Generation",
                description: "Optimized forms to capture and convert leads effectively"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&crop=center",
                title: "Service Showcase",
                description: "Beautiful presentation of your services and offerings"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
                title: "Testimonials",
                description: "Build trust with customer testimonials and reviews"
            }
        ],
        pricingOptions: [
            { label: "base" as Plans, price: 149, discountPercentage: 0 },
            { label: "plus" as Plans, price: 249, discountPercentage: 10 },
            { label: "pro" as Plans, price: 399, discountPercentage: 20 },
            { label: "ultimate" as Plans, price: 649, discountPercentage: 25 }
        ],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        rating: 4.7,
        reviews: 156,
        views: 3120,
        isHotDeal: true,
        timeLeft: "1 day left"
    },
    {
        _id: '4',
        title: "Blog Platform",
        shortDescription: "Modern blogging platform with advanced features",
        longDescription: "A feature-rich blogging platform with content management, SEO tools, and social media integration. Perfect for content creators and publishers.",
        coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=450&fit=crop&crop=center",
        deliverables: [
            "Blog platform",
            "Content management system",
            "SEO optimization tools",
            "Social media integration",
            "Comment system",
            "Newsletter integration"
        ],
        category: "blog" as CategoryType,
        features: [
            {
                imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop&crop=center",
                title: "Content Management",
                description: "Easy-to-use content management system for bloggers"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&crop=center",
                title: "SEO Tools",
                description: "Built-in SEO optimization tools for better rankings"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
                title: "Social Integration",
                description: "Seamless social media integration and sharing"
            }
        ],
        pricingOptions: [
            { label: "base" as Plans, price: 179, discountPercentage: 0 },
            { label: "plus" as Plans, price: 299, discountPercentage: 12 },
            { label: "pro" as Plans, price: 479, discountPercentage: 22 },
            { label: "ultimate" as Plans, price: 779, discountPercentage: 28 }
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        rating: 4.6,
        reviews: 203,
        views: 4560,
        isHotDeal: false
    },
    {
        _id: '5',
        title: "Custom Web Application",
        shortDescription: "Tailored web application for specific business needs",
        longDescription: "A custom web application designed specifically for your business requirements. Includes custom features, integrations, and scalable architecture.",
        coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=450&fit=crop&crop=center",
        deliverables: [
            "Custom web application",
            "Database design",
            "API development",
            "User authentication",
            "Admin dashboard",
            "Documentation"
        ],
        category: "custom" as CategoryType,
        features: [
            {
                imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=225&fit=crop&crop=center",
                title: "Custom Features",
                description: "Tailored features designed for your specific business needs"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&crop=center",
                title: "Scalable Architecture",
                description: "Built with scalability in mind for future growth"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
                title: "API Integration",
                description: "Seamless integration with existing systems and APIs"
            }
        ],
        pricingOptions: [
            { label: "base" as Plans, price: 999, discountPercentage: 0 },
            { label: "plus" as Plans, price: 1499, discountPercentage: 15 },
            { label: "pro" as Plans, price: 2499, discountPercentage: 25 },
            { label: "ultimate" as Plans, price: 3999, discountPercentage: 30 }
        ],
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        rating: 4.9,
        reviews: 67,
        views: 890,
        isHotDeal: false
    }
]

const categories = [
    { value: "all", label: "All Categories", icon: "🌐" },
    { value: "ecommerce", label: "E-commerce", icon: "🛒" },
    { value: "portfolio", label: "Portfolio", icon: "🎨" },
    { value: "blog", label: "Blog", icon: "📝" },
    { value: "landing", label: "Landing Page", icon: "🎯" },
    { value: "custom", label: "Custom", icon: "⚙️" }
]

interface ProductCardProps {
    product: any
    index: number
}

const ProductCard = ({ product, index }: ProductCardProps) => {
    const basePrice = product.pricingOptions.find((p: PricingTier) => p.label === 'base')?.price || 0
    const discountedPrice = product.pricingOptions.find((p: PricingTier) => p.label === 'base')?.price || 0

    return (
        <div
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20 hover:border-teal-500/40 transition-all"
        >

            <div className="p-5">
                <div className="relative w-full mb-4 rounded-xl overflow-hidden aspect-[16/9]">
                    <Image
                        src={product.coverImage}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-500 opacity-20" /> */}
                </div>

                <div className="mb-3">
                    <span className="text-xs text-teal-400 font-medium capitalize">{product.category}</span>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{product.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2">{product.shortDescription}</p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                    {(() => {
                        const baseTier = product.pricingOptions.find((p: PricingTier) => p.label === 'base');
                        const discount = baseTier?.discountPercentage || 0;
                        const finalPrice = baseTier
                            ? Math.round(baseTier.price * (1 - discount / 100))
                            : 0;
                        return (
                            <>
                                {discount > 0 && (
                                    <span className="text-xs text-green-400 font-semibold mr-1">
                                        -{discount}%
                                    </span>
                                )}
                                <span className="text-xl font-bold text-white">
                                    ${finalPrice}
                                </span>
                            </>
                        );
                    })()}
                    <span className="text-xs text-gray-400 line-through">
                        ${basePrice}
                    </span>
                </div>

                {/* Features Preview */}
                <div className="space-y-1 mb-4">
                    {product.features.slice(0, 2).map((feature: ProductFeature, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" />
                            <span className="text-xs text-gray-400">{feature.title}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/marketplace/${product._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg transition-all"
                    >
                        View Details
                        <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                    <button className="p-2 rounded-full border border-teal-500/30 hover:border-teal-500/60 transition-all">
                        <HeartIcon className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Marketplace() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    const [products, setProducts] = useState(dummyProducts)
    const [filteredProducts, setFilteredProducts] = useState(dummyProducts)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        let filtered = products

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered = [...filtered].sort((a, b) => {
                    const aPrice = a.pricingOptions.find((p: PricingTier) => p.label === 'base')?.price || 0
                    const bPrice = b.pricingOptions.find((p: PricingTier) => p.label === 'base')?.price || 0
                    return aPrice - bPrice
                })
                break
            case 'price-high':
                filtered = [...filtered].sort((a, b) => {
                    const aPrice = a.pricingOptions.find((p: PricingTier) => p.label === 'base')?.price || 0
                    const bPrice = b.pricingOptions.find((p: PricingTier) => p.label === 'base')?.price || 0
                    return bPrice - aPrice
                })
                break
            case 'rating':
                filtered = [...filtered].sort((a, b) => b.rating - a.rating)
                break
            case 'newest':
                filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
        }

        setFilteredProducts(filtered)
    }, [products, searchTerm, selectedCategory, sortBy])

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
                <section className="pt-32 pb-0 px-4">
                    <div className="max-w-7xl mx-auto">

                        {/* Search and Filters */}
                        <div className="mb-8">
                            <div className="flex flex-col gap-4">
                                {/* Search and Sort Row */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search */}
                                    <div className="flex-1 relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-teal-500/20 rounded-lg text-white placeholder-gray-400 focus:border-teal-500/50 focus:outline-none text-sm"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2.5 bg-slate-900/50 border border-teal-500/20 rounded-lg text-white focus:border-teal-500/50 focus:outline-none text-sm min-w-[140px]"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                    </select>
                                </div>

                                <div className='flex items-center justify-between'>
                                    {/* Category Filter */}
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {categories.map((category) => (
                                            <button
                                                key={category.value}
                                                onClick={() => setSelectedCategory(category.value)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === category.value
                                                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                                                    : 'bg-slate-900/50 border border-teal-500/20 text-gray-400 hover:border-teal-500/40'
                                                    }`}
                                            >
                                                {/* <span className="text-sm">{category.icon}</span> */}
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Results Count */}
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs">
                                            Showing {filteredProducts.length} of {products.length} products
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="px-4 pb-20">
                    <div className="max-w-7xl mx-auto">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard key={product._id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                                <p className="text-gray-400 mb-6">
                                    Try adjusting your search terms or filters
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('')
                                        setSelectedCategory('all')
                                        setSortBy('newest')
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg transition-all"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>
                <Footer />
            </div>
        </main>
    )
}
