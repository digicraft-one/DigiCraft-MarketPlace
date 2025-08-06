"use client";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HotDeals from "@/components/HotDeals";
import Navbar from "@/components/Navbar";
import Platforms from "@/components/Platforms";
import TopPicks from "@/components/TopPicks";
import { motion, useScroll, useTransform } from "framer-motion";

const GradientOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
    </div>
);

const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(123,49,255,0.1) 1px, transparent 1px),
                         linear-gradient(rgba(123,49,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "4rem 4rem",
            }}
        />
    </div>
);


export default function Home() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <main className="relative">
            <motion.div
                className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(123,49,255,0.05)_0%,transparent_100%)]"
                style={{ y }}
            />
            <GradientOrbs />
            <GridBackground />

            <div className="relative">
                <Navbar />
                <div className="relative">
                    <Hero />
                    <HotDeals />
                    <TopPicks />
                    <Platforms />
                    <Footer />
                </div>
            </div>
        </main>
    );
}
