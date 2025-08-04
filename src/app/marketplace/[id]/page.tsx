"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import type { CategoryType, Plans, PricingTier } from "@/types/schemas";
import {
    ArrowLeftIcon,
    CheckIcon,
    InformationCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Background Components
const GradientOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
    </div>
);

const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px),
                         linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px)`,
                backgroundSize: "4rem 4rem",
            }}
        />
    </div>
);

// Loading Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
            <div className="mt-4 text-center">
                <p className="text-white text-lg font-semibold">Loading product...</p>
                <p className="text-gray-400 text-sm">Please wait while we fetch the details</p>
            </div>
        </div>
    </div>
);

interface PricingCardProps {
    tier: PricingTier;
    isPopular?: boolean;
    product: string;
    title: string;
    onSelect: (id: string, title: string, tier: PricingTier) => void;
}

// Plan-specific features for tooltips
const getPlanFeatures = (planLabel: Plans) => {
    switch (planLabel) {
        case "base":
            return [
                "Logo Update",
                "1 Week Support",
                "Brand Modification",
                "Analytics",
            ];
        case "plus":
            return ["All base features", "UI/UX Redesign", "Email Marketing"];
        case "pro":
            return [
                "All plus features",
                "Social Media Integration",
                "SEO Optimization",
                "Features Addition",
            ];
        case "ultimate":
            return [
                "Complete Freelance Model",
                "Custom Development",
                "Full Source Code",
                "Dedicated Support",
                "No Resell Restrictions",
            ];
        default:
            return ["Standard features"];
    }
};

const PricingCard = ({
    tier,
    product,
    title,
    isPopular = false,
    onSelect,
}: PricingCardProps) => {
    const discountPercentage = tier.discountPercentage || 0;
    const finalPrice = Math.round(tier.price * (1 - discountPercentage / 100));
    const planFeatures = getPlanFeatures(tier.label);
    const [showTooltip, setShowTooltip] = useState(false);
    const isUltimate = tier.label === "ultimate";

    const handleClick = () => {
        if (isUltimate) window.open("https://digicraft.one", "_blank");
        else onSelect(product, title, tier);
    };

    return (
        <div
            className={`relative p-6 rounded-2xl border transition-all ${isUltimate
                    ? "bg-gradient-to-br from-orange-500/8 to-amber-500/8 border-orange-500/25 hover:border-orange-500/35"
                    : isPopular
                        ? "bg-gradient-to-br from-teal-500/10 to-blue-500/10 border-teal-500/40"
                        : "bg-slate-900/50 border-teal-500/20 hover:border-teal-500/40"
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
                                ? "text-gray-400 hover:text-orange-300"
                                : "text-gray-400 hover:text-teal-400"
                            }`}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                    />

                    {/* Tooltip */}
                    <div
                        className={`absolute right-0 top-6 w-64 bg-slate-800 border rounded-lg p-4 shadow-xl transition-all duration-300 z-50 ${isUltimate
                                ? "border-orange-500/20"
                                : "border-teal-500/20"
                            } ${showTooltip
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            }`}>
                        <div className="text-sm text-white font-semibold mb-2 capitalize">
                            {tier.label} Plan Includes:
                        </div>
                        <ul className="space-y-1">
                            {planFeatures.map((feature, index) => (
                                <li
                                    key={index}
                                    className="text-xs text-gray-300 flex items-center gap-2">
                                    <CheckIcon
                                        className={`w-3 h-3 flex-shrink-0 ${isUltimate
                                                ? "text-orange-300"
                                                : "text-teal-400"
                                            }`}
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {/* Tooltip Arrow */}
                        <div
                            className={`absolute -top-2 right-4 w-4 h-4 bg-slate-800 border-l border-t transform rotate-45 ${isUltimate
                                    ? "border-orange-500/20"
                                    : "border-teal-500/20"
                                }`}></div>
                    </div>
                </div>
            </div>

            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 capitalize">
                    {tier.label}
                </h3>
                {isUltimate ? (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                            Custom Development
                        </p>
                        <p className="text-xs text-gray-400 p-0 m-0">
                            Contact for pricing
                        </p>
                    </div>
                ) : (
                    <div className="flex items-baseline justify-center gap-2">
                        {discountPercentage > 0 && (
                            <span className="text-sm text-green-400 font-semibold">
                                -{discountPercentage}%
                            </span>
                        )}
                        <span className="text-3xl font-bold text-white">
                            ₹{finalPrice}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{tier.price}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleClick}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${isUltimate
                        ? "bg-gradient-to-r from-orange-500/85 to-amber-500/85 text-white hover:shadow-lg hover:from-orange-600/95 hover:to-amber-600/95"
                        : isPopular
                            ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg"
                            : "bg-slate-800/50 text-white border border-teal-500/30 hover:border-teal-500/60"
                    }`}>
                {isUltimate ? "Contact DigiCraft" : `Select ${tier.label}`}
            </button>
        </div>
    );
};

export default function ProductDetail() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const params = useParams();
    const router = useRouter();
    const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAPI<Product>(`/products/${params.id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to fetch product");
                toast.error("Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    // Loading state
    if (loading) {
        return (
            <main className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />
                <GradientOrbs />
                <GridBackground />
                <div className="relative">
                    <Navbar />
                    <LoadingSpinner />
                    <Footer />
                </div>
            </main>
        );
    }

    // Error state
    if (error || !product) {
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
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Product Not Found
                            </h1>
                            <p className="text-gray-400 mb-8">
                                The product you&apos;re looking for doesn&apos;t
                                exist.
                            </p>
                            <Link
                                href="/marketplace"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg transition-all">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Marketplace
                            </Link>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>
        );
    }

    const openFeatureModal = (index: number) => {
        setSelectedFeature(index);
    };

    const closeFeatureModal = () => {
        setSelectedFeature(null);
    };

    const handlePurchase = (id: string, title: string, tier: PricingTier) => {
        // Store product ID and plan type in session storage
        sessionStorage.setItem('selectedProductId', id);
        sessionStorage.setItem('selectedPlanType', tier.label);
        router.push(
            `/contact?product=${id}&title=${title}&adjustmentType=${tier.label}`
        );
    };

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
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Marketplace
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Product Image */}
                            <div className="relative">
                                <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/9]">
                                    <Image
                                        src={product.coverImage.url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm text-teal-400 font-medium capitalize">
                                        {product.category}
                                    </span>
                                    <h1 className="text-4xl font-bold text-white mb-4">
                                        {product.title}
                                    </h1>
                                    <p className="text-xl text-gray-400 mb-2">
                                        {product.shortDescription}
                                    </p>
                                    {/* Dags/Tags after short description */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {product.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block bg-teal-500/10 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* long description */}
                                <div>{product.longDescription}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Choose Your Plan */}
                <section id="pricing-section" className="px-4 py-16">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            Choose Your Plan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {product.pricingOptions.map((tier) => (
                                <PricingCard
                                    key={tier.label}
                                    tier={tier}
                                    isPopular={tier.label === "plus"}
                                    product={product._id}
                                    title={product.title}
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
                                    <h2 className="text-2xl font-bold text-white mb-6">
                                        Key Features
                                    </h2>
                                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.features.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-slate-900/50 border border-teal-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-teal-500/40 hover:shadow-lg cursor-pointer group"
                                                    onClick={() => openFeatureModal(index)}>
                                                    <div className="flex">
                                                        {/* Feature Image - Left Side */}
                                                        <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden">
                                                            <Image
                                                                src={feature.imageUrl}
                                                                alt={feature.title}
                                                                fill
                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        </div>

                                                        {/* Feature Content - Right Side */}
                                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                                                                    {feature.title}
                                                                </h3>
                                                                <p className="text-gray-400 text-sm line-clamp-1">
                                                                    {feature.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Feature Modal */}
                                {selectedFeature !== null && (
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                                            {/* Modal Header */}
                                            <div className="flex items-center justify-between p-6 border-b border-teal-500/20">
                                                <h3 className="text-2xl font-bold text-white">
                                                    {product.features[selectedFeature].title}
                                                </h3>
                                                <button
                                                    onClick={closeFeatureModal}
                                                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                                    <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                                                </button>
                                            </div>

                                            {/* Modal Content */}
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Large Feature Image */}
                                                    <div className="relative w-full h-80 rounded-xl overflow-hidden">
                                                        <Image
                                                            src={product.features[selectedFeature].imageUrl}
                                                            alt={product.features[selectedFeature].title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    {/* Detailed Description */}
                                                    <div className="space-y-6">
                                                        <div>
                                                            <h4 className="text-xl font-bold text-white mb-4">
                                                                {product.features[selectedFeature].title}
                                                            </h4>
                                                            <p className="text-gray-300 leading-relaxed text-lg">
                                                                {product.features[selectedFeature].description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Product Info */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        What You&apos;ll Get
                                    </h3>
                                    <div className="space-y-3">
                                        {product.deliverables.map(
                                            (deliverable, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3">
                                                    <CheckIcon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                                    <span className="text-gray-300">
                                                        {deliverable}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
}
