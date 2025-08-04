"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchAPI } from "@/lib/api";
import type { PlanType as Plans } from "@/lib/types";
import {
    FaChevronRight,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhoneAlt,
} from "react-icons/fa";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const PLAN_OPTIONS: Plans[] = ["base", "plus", "pro", "ultimate"];

// Starfield background to match the image
const Starfield = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 0.5}px`,
                    height: `${Math.random() * 2 + 0.5}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 2 + 2}s`,
                }}
            />
        ))}
    </div>
);

// Geometric pattern overlay
const GeometricPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `
                linear-gradient(45deg, transparent, transparent 35%, rgba(0,255,255,0.03) 35%, rgba(0,255,255,0.03) 65%, transparent 65%),
                linear-gradient(-45deg, transparent, transparent 35%, rgba(0,255,255,0.03) 35%, rgba(0,255,255,0.03) 65%, transparent 65%)
            `,
                backgroundSize: "60px 60px",
            }}
        />
    </div>
);

interface EnquiryFormState {
    name: string;
    email: string;
    phone: string;
    message: string;
    adjustmentType: Plans;
    product?: string;
}

// Loading component for Suspense fallback
const ContactFormLoading = () => (
    <div className="relative">
        <Navbar />
        <main className="relative h-screen bg-[#0a0f1c] overflow-hidden flex items-center justify-center">
            <Starfield />
            <GeometricPattern />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#1a2332] to-[#0a0f1c]" />
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 mt-12 w-screen">
                <div className="w-full max-w-6xl flex flex-row-reverse items-start gap-12">
                    <div className="flex-1 flex flex-col text-center md:text-left my-auto gap-6">
                        <div className="animate-pulse">
                            <div className="h-12 bg-gray-700 rounded mb-4"></div>
                            <div className="h-6 bg-gray-700 rounded mb-2"></div>
                            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                        </div>
                    </div>
                    <div className="flex-1/3">
                        <div className="bg-[#1a2332]/40 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-4 md:p-6 shadow-2xl">
                            <div className="animate-pulse space-y-6">
                                <div className="h-8 bg-gray-700 rounded"></div>
                                <div className="space-y-4">
                                    <div className="h-10 bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
);

// Main form component that uses useSearchParams
function EnquiryFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get product ID from URL parameters first, then from session storage
    const productFromParams = searchParams.get("product") as string;
    const productFromSession = typeof window !== 'undefined' ? sessionStorage.getItem('selectedProductId') : null;
    const product = productFromParams || productFromSession || undefined;
    
    const title = searchParams.get("title") as string;
    
    // Get plan type from URL parameters first, then from session storage
    const adjustmentTypeFromParams = searchParams.get("adjustmentType") as Plans;
    const adjustmentTypeFromSession = typeof window !== 'undefined' ? sessionStorage.getItem('selectedPlanType') : null;
    const adjustmentType = adjustmentTypeFromParams || adjustmentTypeFromSession || undefined;

    const DEFAULT_VALUES: EnquiryFormState = {
        name: "",
        email: "",
        phone: "",
        message: "",
        adjustmentType,
        product: product,
    };

    const [formData, setFormData] = useState<EnquiryFormState>(DEFAULT_VALUES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = <K extends keyof EnquiryFormState>(
        field: K,
        value: EnquiryFormState[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetchAPI("/enquiries", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            toast.success("Enquiry submitted. We'll contact you soon.");

            setFormData(DEFAULT_VALUES);
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Submission failed";
            setError(message);
            console.error(err);
            toast.error("Submission failed. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Check if product ID and plan type exist (from params or session storage)
    if (!product || !adjustmentType) {
        Swal.fire({
            title: "Product & Plan Selection Required",
            text: "You must select a product and plan first to contact us. Redirecting to marketplace...",
            icon: "info",
            showConfirmButton: false,
            timer: 3000,
        });

        setTimeout(() => {
            router.push("/marketplace");
        }, 3000);

        return null;
    }

    return (
        <div className="relative">
            <Navbar />
            <main className="relative h-auto bg-[#0a0f1c] overflow-hidden flex items-center justify-center pt-20 pb-10">
                {/* Background Elements */}
                <Starfield />
                <GeometricPattern />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#1a2332] to-[#0a0f1c]" />

                {/* Content Container */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4 mt-12 w-screen">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-6xl flex flex-row-reverse items-start gap-12">
                        {/* Header Section (Left Side) */}
                        <div className="flex-1 flex flex-col text-center md:text-left my-auto gap-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-4xl md:text-5xl font-bold mb-6 leading-tight flex flex-col items-center">
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                    Get Started{" "}
                                </span>
                                <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                                    Today
                                </span>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    className="text-base text-gray-300 max-w-md mx-auto mt-2 md:mx-0 leading-relaxed font-medium text-center">
                                    Fill out the form and we&apos;ll <br />
                                    connect you with the perfect solution.
                                </motion.p>
                            </motion.h1>



                            {/* Reach Us Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="bg-[#1a2332]/40 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-2xl ">
                                <div className="space-y-4 text-gray-300">
                                    <div className="flex space-x-3 items-center">
                                        <FaPhoneAlt className="text-cyan-400 size-5" />
                                        <span>
                                            +91 8299797516, +91 6203785043
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-cyan-400 size-5" />
                                        <span>hello@digicraft.one</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaMapMarkerAlt className="text-cyan-400 size-5" />

                                        <span>
                                            Jamui, Chunar Mirzapur,
                                            <br />
                                            Uttar Pradesh, India - 231304
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Container (Right Side) */}
                        <div className="flex-1/3">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="bg-[#1a2332]/40 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
                                {/* Subtle glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 rounded-3xl" />
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                                <div className="relative z-10">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6">
                                        {/* Personal Information Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <h3 className="text-xl font-semibold text-white">
                                                    Send us a message
                                                </h3>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="name"
                                                        className="text-gray-300 font-medium">
                                                        Full Name *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        className="bg-[#0a0f1c]/60 border-gray-600/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-10 transition-all duration-300 hover:border-gray-500/50"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="phone"
                                                        className="text-gray-300 font-medium">
                                                        Phone Number
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "phone",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="bg-[#0a0f1c]/60 border-gray-600/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-10 transition-all duration-300 hover:border-gray-500/50"
                                                        placeholder="Your phone number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-gray-300 font-medium">
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    className="bg-[#0a0f1c]/60 border-gray-600/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-10 transition-all duration-300 hover:border-gray-500/50"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Details Section */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-gray-300 font-medium">
                                                    Selected Product
                                                </Label>
                                                <div className="bg-[#0a0f1c]/40 border border-gray-700/30 rounded-xl p-3">
                                                    <ProductCard productId={product} plan={formData.adjustmentType} />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="adjustmentType"
                                                    className="text-gray-300 font-medium">
                                                    Plan Type
                                                </Label>
                                                <Select
                                                    value={
                                                        formData.adjustmentType
                                                    }
                                                    onValueChange={(val) =>
                                                        handleChange(
                                                            "adjustmentType",
                                                            val as Plans
                                                        )
                                                    }>
                                                    <SelectTrigger className="bg-[#0a0f1c]/60 border-gray-600/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-10 hover:border-gray-500/50 transition-all duration-300">
                                                        <SelectValue placeholder="Select a plan" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#1a2332] border-gray-600/30 rounded-xl">
                                                        {PLAN_OPTIONS.map(
                                                            (plan) => (
                                                                <SelectItem
                                                                    key={
                                                                        plan
                                                                    }
                                                                    value={
                                                                        plan
                                                                    }
                                                                    className="text-white hover:bg-[#0a0f1c]/60 focus:bg-[#0a0f1c]/60 rounded-lg">
                                                                    <span className="flex items-center">
                                                                        <div
                                                                            className={`w-2 h-2 rounded-full mr-3 ${plan ===
                                                                                    "base"
                                                                                    ? "bg-green-400"
                                                                                    : plan ===
                                                                                        "plus"
                                                                                        ? "bg-blue-400"
                                                                                        : plan ===
                                                                                            "pro"
                                                                                            ? "bg-cyan-400"
                                                                                            : "bg-yellow-400"
                                                                                }`}
                                                                        />
                                                                        {plan
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            plan.slice(
                                                                                1
                                                                            )}
                                                                    </span>
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Message Section */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="message"
                                                    className="text-gray-300 font-medium">
                                                    Message
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "message",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-[#0a0f1c]/60 border-gray-600/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl min-h-[80px] resize-none transition-all duration-300 hover:border-gray-500/50"
                                                    placeholder="Tell us about your project requirements, timeline, or any specific questions..."
                                                />
                                            </div>
                                        </div>

                                        {/* Error Display */}
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                                <p className="text-red-400 text-sm font-medium">
                                                    {error}
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Submit Button */}
                                        <div>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                                {loading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                                        Submitting...
                                                    </div>
                                                ) : (
                                                    <span className="flex items-center gap-2 justify-center text-lg">
                                                        Let&apos;s Connect
                                                        <FaChevronRight />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Main component with Suspense boundary
export default function EnquiryForm() {
    return (
        <Suspense fallback={<ContactFormLoading />}>
            <EnquiryFormContent />
        </Suspense>
    );
}
