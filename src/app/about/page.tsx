"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    CheckCircleIcon,
    CodeBracketIcon,
    GlobeAltIcon,
    HeartIcon,
    RocketLaunchIcon,
    SparklesIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";

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

const values = [
    {
        icon: SparklesIcon,
        title: "Innovation",
        description: "We constantly push boundaries and explore new technologies to deliver cutting-edge solutions."
    },
    {
        icon: HeartIcon,
        title: "Passion",
        description: "We're passionate about creating digital experiences that make a real impact on businesses and users."
    },
    {
        icon: CheckCircleIcon,
        title: "Quality",
        description: "Every project we deliver meets the highest standards of quality and performance."
    },
    {
        icon: UserGroupIcon,
        title: "Collaboration",
        description: "We believe in working closely with our clients to understand their vision and bring it to life."
    }
];

const stats = [
    { number: "50+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "24/7", label: "Support Available" },
    { number: "99%", label: "Client Satisfaction" }
];

export default function About() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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



                {/* Story Section */}
                <section className="py-20 px-4 pt-40">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        >
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-6">
                                    Our Story
                                </h2>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Founded with a vision to bridge the gap between creativity and technology, DigiCraft emerged from the belief that every business deserves access to world-class digital solutions.
                                </p>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    What started as a small team of passionate developers and designers has grown into a comprehensive digital agency that serves clients worldwide. We've helped hundreds of businesses transform their digital presence and achieve their goals.
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                    Today, we continue to push the boundaries of what's possible in the digital world, always staying ahead of the latest trends and technologies to deliver exceptional results for our clients.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="aspect-video rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm border border-teal-500/30 p-8">
                                    <div className="h-full flex items-center justify-center">
                                        <RocketLaunchIcon className="w-32 h-32 text-teal-400" />
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-30" />
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-xl opacity-30" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Hero Section */}
                <section className="pt-10 pb-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        >
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>


                {/* Values Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Our Values
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                These core values guide everything we do and shape the way we work with our clients.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/30 to-transparent backdrop-blur-sm border border-teal-500/20"
                                >
                                    <div className="flex-shrink-0">
                                        <value.icon className="w-8 h-8 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Meet Our Team
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                We're a diverse team of creative professionals, developers, designers, and strategists who are passionate about delivering exceptional digital experiences.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm border border-teal-500/30 flex items-center justify-center">
                                    <UserGroupIcon className="w-16 h-16 text-teal-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Creative Team
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    UI/UX designers, graphic artists, and creative directors who bring your vision to life with stunning visuals and intuitive experiences.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center">
                                    <CodeBracketIcon className="w-16 h-16 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Development Team
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Full-stack developers, mobile app specialists, and DevOps engineers who build robust, scalable, and high-performance applications.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center">
                                    <GlobeAltIcon className="w-16 h-16 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Strategy Team
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Digital strategists, project managers, and business analysts who ensure your project aligns with your business goals and delivers measurable results.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Ready to Start Your Project?
                            </h2>
                            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                                Let's work together to bring your digital vision to life. Our team is ready to help you create something extraordinary.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-lg font-semibold overflow-hidden transition-all hover:shadow-lg hover:shadow-teal-500/25"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="relative z-10">Explore Our Marketplace</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    );
} 