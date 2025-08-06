"use client";
import {
  ArrowRightIcon,
  ClockIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const hotDeals = [
    {
        id: 1,
        title: "E-Commerce Store Pro",
        originalPrice: 299,
        discountedPrice: 149,
        discount: "50% OFF",
        image: "/products/color-picker.png",
        features: [
            "Full E-commerce Functionality",
            "Payment Gateway Integration",
            "Inventory Management",
            "Mobile Responsive",
            "SEO Optimized",
        ],
        timeLeft: "2 days left",
        category: "E-commerce",
    },
    {
        id: 2,
        title: "Portfolio Showcase",
        originalPrice: 199,
        discountedPrice: 99,
        discount: "50% OFF",
        image: "/products/excela.webp",
        features: [
            "Portfolio Gallery",
            "Contact Forms",
            "Blog Integration",
            "Social Media Links",
            "Custom Domain Ready",
        ],
        timeLeft: "1 day left",
        category: "Portfolio",
    },
    {
        id: 3,
        title: "Restaurant Website",
        originalPrice: 249,
        discountedPrice: 124,
        discount: "50% OFF",
        image: "/products/color-picker.png",
        features: [
            "Menu Management",
            "Online Ordering",
            "Table Reservations",
            "Customer Reviews",
            "Location Integration",
        ],
        timeLeft: "3 days left",
        category: "Business",
    },
];

interface HotDealCardProps {
    title: string;
    originalPrice: number;
    discountedPrice: number;
    discount: string;
    image: string;
    features: string[];
    timeLeft: string;
    category: string;
    index: number;
}

const HotDealCard = ({
    title,
    originalPrice,
    discountedPrice,
    discount,
    image,
    features,
    timeLeft,
    category,
    index,
}: HotDealCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-transparent backdrop-blur-sm border border-teal-500/20">
        {/* Discount Badge */}
        <div className="absolute top-4 right-4 z-10">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <FireIcon className="w-4 h-4" />
                {discount}
            </div>
        </div>

        {/* Time Left Badge */}
        <div className="absolute top-4 left-4 z-10">
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {timeLeft}
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
                <span className="text-sm text-teal-400 font-medium">
                    {category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-white">
                    ${discountedPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                    ${originalPrice}
                </span>
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
                href={`/deal/${title.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg transition-all w-full justify-center">
                Get This Deal
                <ArrowRightIcon className="w-4 h-4" />
            </Link>
        </div>
    </motion.div>
);

const HotDeals = () => {
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
                        <FireIcon className="w-8 h-8 text-red-500" />
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                            Hot Deals
                        </h2>
                        <FireIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Limited time offers on our most popular pre-built
                        websites. Don&apos;t miss out on these incredible discounts!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotDeals.map((deal, index) => (
                        <HotDealCard key={deal.id} {...deal} index={index} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center mt-12">
                    <Link
                        href="/hot-deals"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                        View All Hot Deals
                        <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HotDeals;
