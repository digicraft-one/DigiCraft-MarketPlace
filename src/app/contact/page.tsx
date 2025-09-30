"use client";

import ApplicationForm from "@/components/ApplicationForm";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Starfield background
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

// Toggle button (puller)
const FormToggle = ({
    isApplicationVisible,
    onToggle,
}: {
    isApplicationVisible: boolean;
    onToggle: () => void;
}) => (
    <motion.button
        initial={{ x: 0 }}
        animate={{ x: isApplicationVisible ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={onToggle}
        className="fixed right-0 top-1/2 z-50 flex items-center justify-center w-12 h-12 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 rounded-l-full shadow-lg cursor-pointer group">
        {/* Animated arrow */}
        <motion.div
            animate={{ rotate: isApplicationVisible ? -180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-cyan-300 text-xl">
            →
        </motion.div>

        {/* Dynamic label */}
        <span className="absolute -left-26 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-cyan-300 text-sm">
            {isApplicationVisible ? "Work With Us" : "Join Our Team"}
        </span>
    </motion.button>
);

// Main form component
export default function ContactForm() {
    const [showApplication, setShowApplication] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="relative">
            <Navbar />
            <main className="relative h-auto bg-[#0a0f1c] overflow-hidden pt-20 pb-10">
                {/* Background Elements */}
                <Starfield />
                <GeometricPattern />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#1a2332] to-[#0a0f1c]" />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 sm:px-8 md:px-10 lg:px-20 w-full">
                    <AnimatePresence mode="wait">
                        {showApplication ? (
                            <motion.div
                                key="application"
                                initial={{ opacity: 0, x: 300 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -300 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                                className="w-full max-w-6xl">
                                <ApplicationForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="enquiry"
                                initial={{ opacity: 0, x: -300 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 300 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                                className="w-full max-w-6xl">
                                <EnquiryForm />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />

            {isClient && (
                <FormToggle
                    isApplicationVisible={showApplication}
                    onToggle={() => setShowApplication(!showApplication)}
                />
            )}
        </div>
    );
}
