"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import type {
    CategoryType,
    PricingTier,
    ProductFeature,
} from "@/types/schemas";
import {
    ArrowRightIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

// Loading Skeleton Component
const ProductCardSkeleton = () => (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20 animate-pulse">
        <div className="p-5">
            <div className="relative w-full mb-4 rounded-xl overflow-hidden aspect-[16/9] bg-slate-800/50" />

            <div className="mb-3">
                <div className="w-16 h-3 bg-slate-800/50 rounded mb-2" />
                <div className="w-full h-5 bg-slate-800/50 rounded mb-1" />
                <div className="w-3/4 h-3 bg-slate-800/50 rounded" />
            </div>

            <div className="flex items-baseline gap-2 mb-3">
                <div className="w-12 h-6 bg-slate-800/50 rounded" />
                <div className="w-8 h-3 bg-slate-800/50 rounded" />
            </div>

            <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-800/50" />
                    <div className="w-20 h-2 bg-slate-800/50 rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-800/50" />
                    <div className="w-24 h-2 bg-slate-800/50 rounded" />
                </div>
            </div>

            <div className="w-full h-8 bg-slate-800/50 rounded-full" />
        </div>
    </div>
);

// Loading State Component
const LoadingState = () => (
    <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
            We are loading marketplace for you
        </h3>
        <p className="text-gray-400">
            Please wait while we fetch the latest products...
        </p>
    </div>
);

// Empty State Component
const EmptyState = ({ onClearFilters }: { onClearFilters: () => void }) => (
    <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-white mb-2">
            No products found
        </h3>
        <p className="text-gray-400 mb-6">
            We couldn&apos;t find any products matching your criteria. Try
            adjusting your search terms or filters.
        </p>
        <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg transition-all">
            Clear Filters
        </button>
    </div>
);

const categories: { value: CategoryType | "all"; label: string }[] = [
    { value: "all", label: "All Categories" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "portfolio", label: "Portfolio" },
    { value: "blog", label: "Blog" },
    { value: "landing", label: "Landing Page" },
    { value: "custom", label: "Custom" },
];

interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const basePrice =
        product.pricingOptions.find((p: PricingTier) => p.label === "base")
            ?.price || 0;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20 hover:border-teal-500/40 transition-all">
            <div className="p-5">
                <div className="relative w-full mb-4 rounded-xl overflow-hidden aspect-[16/9]">
                    <Image
                        src={product.coverImage.url}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="mb-3">
                    <span className="text-xs text-teal-400 font-medium capitalize">
                        {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                        {product.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2">
                        {product.shortDescription}
                    </p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                    {(() => {
                        const baseTier = product.pricingOptions.find(
                            (p: PricingTier) => p.label === "base"
                        );
                        const discount = baseTier?.discountPercentage || 0;
                        const finalPrice = baseTier
                            ? Math.round(baseTier.price * (1 - discount / 100))
                            : 0;
                        return (
                            <>
                                <span className="text-xl font-bold text-white">
                                    ₹{finalPrice}
                                </span>

                                {discount > 0 && (
                                    <span className="text-xs text-gray-400 line-through">
                                        ₹{basePrice}
                                    </span>
                                )}

                                {discount > 0 && (
                                    <span className="text-xs text-green-400 font-semibold mr-1">
                                        -{discount}% off
                                    </span>
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* Features Preview */}
                <div className="space-y-1 mb-4">
                    {product.features
                        .slice(0, 2)
                        .map((feature: ProductFeature, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" />
                                <span className="text-xs text-gray-400">
                                    {feature.title}
                                </span>
                            </div>
                        ))}
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/marketplace/${product._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg transition-all">
                        View Details
                        <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Marketplace() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<
        CategoryType | "all"
    >("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                const prod = await fetchAPI<Product[]>("/products");
                setProducts(prod);
                setFilteredProducts(prod);
            } catch (error) {
                setHasError(true);
                toast.error("Failed to load products");
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;

        if (selectedCategory !== "all")
            filtered = filtered.filter(
                (product) => product.category === selectedCategory
            );

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (product) =>
                    product.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.shortDescription
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.tags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
        }

        // Sort products
        switch (sortBy) {
            case "price-low":
                filtered = [...filtered].sort((a, b) => {
                    const aPrice =
                        a.pricingOptions.find(
                            (p: PricingTier) => p.label === "base"
                        )?.price || 0;
                    const bPrice =
                        b.pricingOptions.find(
                            (p: PricingTier) => p.label === "base"
                        )?.price || 0;
                    return aPrice - bPrice;
                });
                break;
            case "price-high":
                filtered = [...filtered].sort((a, b) => {
                    const aPrice =
                        a.pricingOptions.find(
                            (p: PricingTier) => p.label === "base"
                        )?.price || 0;
                    const bPrice =
                        b.pricingOptions.find(
                            (p: PricingTier) => p.label === "base"
                        )?.price || 0;
                    return bPrice - aPrice;
                });
                break;
            case "newest":
                filtered = [...filtered].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, selectedCategory, sortBy]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSortBy("newest");
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
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-teal-500/20 rounded-lg text-white placeholder-gray-400 focus:border-teal-500/50 focus:outline-none text-sm"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="px-3 py-2.5 bg-slate-900/50 border border-teal-500/20 rounded-lg text-white focus:border-teal-500/50 focus:outline-none text-sm min-w-[140px]">
                                        <option value="newest">
                                            Newest First
                                        </option>
                                        <option value="price-low">
                                            Price: Low to High
                                        </option>
                                        <option value="price-high">
                                            Price: High to Low
                                        </option>
                                        <option value="rating">
                                            Highest Rated
                                        </option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* Category Filter */}
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {categories.map((category) => (
                                            <button
                                                key={category.value}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category.value
                                                    )
                                                }
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                                    selectedCategory ===
                                                    category.value
                                                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                                                        : "bg-slate-900/50 border border-teal-500/20 text-gray-400 hover:border-teal-500/40"
                                                }`}>
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Results Count */}
                                    {!isLoading && (
                                        <div className="text-center">
                                            <p className="text-gray-400 text-xs">
                                                Showing{" "}
                                                {filteredProducts.length} of{" "}
                                                {products.length} products
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="px-4 pb-20">
                    <div className="max-w-7xl mx-auto">
                        {isLoading ? (
                            <LoadingState />
                        ) : hasError ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Failed to load products
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Something went wrong while loading the
                                    products. Please try again.
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg transition-all">
                                    Try Again
                                </button>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState onClearFilters={handleClearFilters} />
                        )}
                    </div>
                </section>
                <Footer />
            </div>
        </main>
    );
}
