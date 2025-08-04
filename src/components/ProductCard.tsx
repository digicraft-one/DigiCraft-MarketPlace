"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchAPI } from "@/lib/api";
import type { Product } from "@/lib/types";

interface ProductCardProps {
    productId: string;
    plan: string;
}

export default function ProductCard({ productId, plan }: ProductCardProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await fetchAPI<Product>(
                    `/products/${productId}`
                );
                console.log(productData);
                setProduct(productData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load product"
                );
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a2332]/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-3 shadow-xl">
                <div className="animate-pulse">
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-700 rounded w-16"></div>
                                <div className="h-4 bg-gray-700 rounded w-12"></div>
                            </div>
                            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                        </div>
                        <div className="w-20 h-20 bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (error || !product) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a2332]/40 backdrop-blur-xl border border-red-500/20 rounded-xl p-3 shadow-xl">
                <div className="text-center text-red-400 text-xs">
                    {error || "Product not found"}
                </div>
            </motion.div>
        );
    }

    const basePrice =
        product.pricingOptions.find((p) => p.label === plan)?.price || 0;
    const discount =
        product.pricingOptions.find((p) => p.label === plan)
            ?.discountPercentage || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a2332]/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-0 shadow-xl hover:border-cyan-500/40 transition-all duration-300 overflow-hidden">
            <div className="flex gap-3 items-center overflow-hidden">
                {/* Product Info - Left Side */}
                <div className="flex-1 min-w-0 pl-3">
                    {/* Category Badge */}
                    <span className="text-sm text-gray-400">
                        <span className="text-white font-bold">
                            {discount > 0
                                ? `₹${basePrice - (basePrice * discount) / 100}`
                                : `₹${basePrice}`}{" "}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{basePrice}
                            </span>
                        )}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                        {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                        {product.shortDescription}
                    </p>
                </div>
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={product.coverImage.url}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            </div>
        </motion.div>
    );
}
