'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    StarIcon,
    EyeIcon,
    HeartIcon,
    ArrowLeftIcon,
    CheckIcon,
    ShoppingCartIcon,
    FireIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    InformationCircleIcon
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

// Dummy data - same as marketplace
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

interface PricingCardProps {
    tier: PricingTier
    isPopular?: boolean
    onSelect: (tier: PricingTier) => void
}

// Plan-specific features for tooltips
const getPlanFeatures = (planLabel: Plans) => {
    switch (planLabel) {
        case 'base':
            return [
                'Logo Update',
                '1 Week Support',
                'Brand Modification',
                'Analytics',
            ]
        case 'plus':
            return [
                'All base features',
                'UI/UX Redesign',
                'Email Marketing',
            ]
        case 'pro':
            return [
                'All plus features',
                'Social Media Integration',
                'SEO Optimization',
                'Features Addition',
            ]
        case 'ultimate':
            return [
                'Complete Freelance Model',
                'Custom Development',
                'Full Source Code',
                'Dedicated Support',
                'No Resell Restrictions'
            ]
        default:
            return ['Standard features']
    }
}

const PricingCard = ({ tier, isPopular = false, onSelect }: PricingCardProps) => {
    const discountPercentage = tier.discountPercentage || 0
    const finalPrice = Math.round(tier.price * (1 - discountPercentage / 100))
    const planFeatures = getPlanFeatures(tier.label)
    const [showTooltip, setShowTooltip] = useState(false)
    const isUltimate = tier.label === 'ultimate'

    const handleClick = () => {
        if (isUltimate) {
            window.open('https://digicraft.one', '_blank')
        } else {
            onSelect(tier)
        }
    }

    return (
        <div className={`relative p-6 rounded-2xl border transition-all ${isUltimate
                ? 'bg-gradient-to-br from-orange-500/8 to-amber-500/8 border-orange-500/25 hover:border-orange-500/35'
                : isPopular
                    ? 'bg-gradient-to-br from-teal-500/10 to-blue-500/10 border-teal-500/40'
                    : 'bg-slate-900/50 border-teal-500/20 hover:border-teal-500/40'
            }`}>
            {isPopular && !isUltimate && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                    </span>
                </div>
            )}

            {isUltimate && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white px-4 py-1 rounded-full text-xs font-bold">
                        ENTERPRISE
                    </span>
                </div>
            )}

            {/* Info Icon with Tooltip */}
            <div className="absolute top-4 right-4">
                <div className="relative">
                    <InformationCircleIcon
                        className={`w-5 h-5 transition-colors cursor-help ${isUltimate
                                ? 'text-gray-400 hover:text-orange-300'
                                : 'text-gray-400 hover:text-teal-400'
                            }`}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                    />

                    {/* Tooltip */}
                    <div className={`absolute right-0 top-6 w-64 bg-slate-800 border rounded-lg p-4 shadow-xl transition-all duration-300 z-50 ${isUltimate
                            ? 'border-orange-500/20'
                            : 'border-teal-500/20'
                        } ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}>
                        <div className="text-sm text-white font-semibold mb-2 capitalize">{tier.label} Plan Includes:</div>
                        <ul className="space-y-1">
                            {planFeatures.map((feature, index) => (
                                <li key={index} className="text-xs text-gray-300 flex items-center gap-2">
                                    <CheckIcon className={`w-3 h-3 flex-shrink-0 ${isUltimate ? 'text-orange-300' : 'text-teal-400'
                                        }`} />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {/* Tooltip Arrow */}
                        <div className={`absolute -top-2 right-4 w-4 h-4 bg-slate-800 border-l border-t transform rotate-45 ${isUltimate
                                ? 'border-orange-500/20'
                                : 'border-teal-500/20'
                            }`}></div>
                    </div>
                </div>
            </div>

            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 capitalize">{tier.label}</h3>
                {isUltimate ? (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-300">Custom Development</p>
                        <p className="text-xs text-gray-400 p-0 m-0">Contact for pricing</p>
                    </div>
                ) : (
                    <div className="flex items-baseline justify-center gap-2">
                        {discountPercentage > 0 && (
                            <span className="text-sm text-green-400 font-semibold">
                                -{discountPercentage}%
                            </span>
                        )}
                        <span className="text-3xl font-bold text-white">${finalPrice}</span>
                        {discountPercentage > 0 && (
                            <span className="text-sm text-gray-400 line-through">${tier.price}</span>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleClick}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${isUltimate
                        ? 'bg-gradient-to-r from-orange-500/85 to-amber-500/85 text-white hover:shadow-lg hover:from-orange-600/95 hover:to-amber-600/95'
                        : isPopular
                            ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg'
                            : 'bg-slate-800/50 text-white border border-teal-500/30 hover:border-teal-500/60'
                    }`}
            >
                {isUltimate ? 'Contact DigiCraft' : `Select ${tier.label}`}
            </button>
        </div>
    )
}

export default function ProductDetail() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    const params = useParams()
    const router = useRouter()
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
    const [expandedFeatures, setExpandedFeatures] = useState<number[]>([])

    const product = dummyProducts.find(p => p._id === params.id)

    if (!product) {
        return (
            <main className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
                <GradientOrbs />
                <GridBackground />

                <div className="relative">
                    <Navbar />
                    <div className="pt-32 pb-20 px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
                            <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
                            <Link
                                href="/marketplace"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg transition-all"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Marketplace
                            </Link>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>
        )
    }

    const toggleFeature = (index: number) => {
        setExpandedFeatures(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    const handlePurchase = (tier: PricingTier) => {
        setSelectedTier(tier)
        // Here you would typically redirect to checkout or open a modal
        console.log('Selected tier:', tier)
    }

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
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="mb-8">
                            <Link
                                href="/marketplace"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Marketplace
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Product Image */}
                            <div className="relative">
                                <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/9]">
                                    <Image
                                        src={product.coverImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-500 opacity-20" />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm text-teal-400 font-medium capitalize">{product.category}</span>
                                    <h1 className="text-4xl font-bold text-white mb-4">{product.title}</h1>
                                    <p className="text-xl text-gray-400 mb-2">{product.shortDescription}</p>
                                    {/* Dags/Tags after short description */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {/* Example tags, replace with dynamic tags if available */}
                                        <span className="inline-block bg-teal-500/10 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/20">Full Stack</span>
                                        <span className="inline-block bg-blue-500/10 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20">Web</span>
                                        <span className="inline-block bg-purple-500/10 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/20">App</span>
                                    </div>
                                </div>

                                {/* long description */}
                                <div>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi atque ipsam adipisci inventore iure molestiae ea delectus, tempore mollitia optio suscipit sit aperiam voluptates perspiciatis doloremque doloribus tempora sapiente maiores, odit omnis architecto nobis. Ipsa quibusdam voluptatibus, fugiat laudantium inventore sint incidunt expedita beatae laboriosam omnis libero perspiciatis amet. Necessitatibus!
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Choose Your Plan */}
                <section className="px-4 py-16">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Plan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {product.pricingOptions.map((tier, index) => (
                                <PricingCard
                                    key={tier.label}
                                    tier={tier}
                                    isPopular={tier.label === 'plus'}
                                    onSelect={handlePurchase}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Description */}
                <section className="px-4 pb-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-12">
                                {/* Features */}
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
                                    <div className="space-y-4">
                                        {product.features.map((feature, index) => (
                                            <div
                                                key={index}
                                                className="bg-slate-900/50 border border-teal-500/20 rounded-xl overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleFeature(index)}
                                                    className="w-full p-6 flex items-center justify-between text-left"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={feature.imageUrl}
                                                                alt={feature.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                    {expandedFeatures.includes(index) ? (
                                                        <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Product Info */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">What You'll Get</h3>
                                    <div className="space-y-3">
                                        {product.deliverables.map((deliverable, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckIcon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                                <span className="text-gray-300">{deliverable}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    )
}
