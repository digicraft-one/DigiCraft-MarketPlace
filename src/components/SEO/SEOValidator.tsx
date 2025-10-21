"use client";

import { useState } from 'react';

interface SEOValidatorProps {
    product: {
        title: string;
        shortDescription: string;
        coverImage: { url: string };
        category: string;
        tags: string[];
        pricingOptions: Array<{
            price: number;
            discountPercentage?: number;
        }>;
    };
    productUrl: string;
}

export default function SEOValidator({ product, productUrl }: SEOValidatorProps) {
    const [isVisible, setIsVisible] = useState(false);
    
    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            >
                SEO Validator
            </button>
        );
    }

    const lowestPrice = Math.min(...product.pricingOptions.map(option => 
        Math.round(option.price * (1 - (option.discountPercentage || 0) / 100))
    ));

    const seoChecks = [
        {
            name: "Title Length",
            status: product.title.length >= 30 && product.title.length <= 60 ? "good" : "warning",
            message: product.title.length < 30 ? "Title too short (min 30 chars)" : 
                    product.title.length > 60 ? "Title too long (max 60 chars)" : "Perfect length"
        },
        {
            name: "Description Length", 
            status: product.shortDescription.length >= 120 && product.shortDescription.length <= 160 ? "good" : "warning",
            message: product.shortDescription.length < 120 ? "Description too short (min 120 chars)" :
                    product.shortDescription.length > 160 ? "Description too long (max 160 chars)" : "Perfect length"
        },
        {
            name: "Image URL",
            status: product.coverImage.url ? "good" : "error",
            message: product.coverImage.url ? "Image URL present" : "Missing image URL"
        },
        {
            name: "Tags",
            status: product.tags && product.tags.length > 0 ? "good" : "warning",
            message: product.tags && product.tags.length > 0 ? `${product.tags.length} tags present` : "No tags found"
        },
        {
            name: "Price Information",
            status: lowestPrice > 0 ? "good" : "error",
            message: lowestPrice > 0 ? `Starting from ₹${lowestPrice}` : "No price information"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "good": return "text-green-500";
            case "warning": return "text-yellow-500";
            case "error": return "text-red-500";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Validator</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    ✕
                </button>
            </div>
            
            <div className="space-y-3">
                {seoChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{check.name}</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${getStatusColor(check.status)}`}>
                                {check.status === "good" ? "✓" : check.status === "warning" ? "⚠" : "✗"}
                            </span>
                            <span className={`text-xs ${getStatusColor(check.status)}`}>
                                {check.message}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Links</h4>
                <div className="space-y-1">
                    <a
                        href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(productUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                    >
                        Facebook Debugger
                    </a>
                    <a
                        href={`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(productUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                    >
                        Twitter Card Validator
                    </a>
                    <a
                        href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(productUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                    >
                        Google Rich Results Test
                    </a>
                </div>
            </div>
        </div>
    );
}