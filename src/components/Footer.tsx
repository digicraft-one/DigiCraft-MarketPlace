"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FaEnvelope,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
    const quickLinks = [
        { target: "_self", name: "About", path: "/about" },
        { target: "_self", name: "Marketplace", path: "/marketplace" },
        { target: "_self", name: "Offers", path: "/offers" },
        { target: "_self", name: "FAQ", path: "/faq" },
        {
            target: "_blank",
            name: "Products",
            path: "https://www.digicraft.one/products",
        },
        {
            target: "_blank",
            name: "Services",
            path: "https://www.digicraft.one/services",
        },
        {
            target: "_blank",
            name: "DigiCraft",
            path: "https://www.digicraft.one",
        },
    ];

    const services = [
        { name: 'Web Development', path: 'http://digicraft.one/services/web-development' },
        { name: 'Mobile App Development', path: 'http://digicraft.one/services/mobile-app-development' },
        { name: 'AI & ML Solutions', path: 'http://digicraft.one/services/ai-ml' },
        { name: 'UI/UX Design', path: 'http://digicraft.one/services/ui-ux' },
        { name: 'E-Commerce Solutions', path: 'http://digicraft.one/services/e-com' },
        { name: 'Cloud Computing', path: 'http://digicraft.one/services/cloud-computing' },
        { name: 'DevOps Services', path: 'http://digicraft.one/services/dev-ops' },
        { name: 'Digital Marketing & SEO', path: 'http://digicraft.one/services/digital-marketing-and-seo' },
        { name: 'SaaS Solutions', path: 'http://digicraft.one/services/saas' },
        { name: 'API Development', path: 'http://digicraft.one/services/api-development-and-Integration' },
        { name: 'Learning Management System', path: 'http://digicraft.one/services/learning-management-system' },
        { name: "Video Editing", path: "https://media.digicraft.one/" },
    ];

    return (
        <footer className="relative pt-24 pb-12 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900/50 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />

            <div className="max-w-7xl mx-auto px-4 relative">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Company Info */}
                    <div>
                        <Link
                            href="/"
                            className="text-2xl font-bold mb-6 block">
                            <span className="text-purple-500">Digi</span>Craft{" "}
                            <span className="text-teal-400 text-base">
                                Marketplace
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-4">
                            Crafting digital experiences that inspire, innovate,
                            and impact.
                        </p>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>DigiCraft Innovation Private Limited</p>
                            <p>CIN: U62010UP2026PTC241890</p>
                            <p>GST: 09AAMCD3672L1Z2</p>
                        </div>
                        <div>
                            <h4 className="text-teal-400 font-medium mt-2">
                                Address
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed flex items-center gap-2">
                                <FaMapMarkerAlt size={20} />
                                Jamui, Chunar, Mirzapur <br />
                                Uttar Pradesh, India - 231304
                            </p>
                        </div>
                        <div className="mt-6 rounded-lg overflow-hidden border border-purple-500/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d439.53847656249995!2d82.9105183!3d25.1207735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e35540d0220e3%3A0x54089218b4735a50!2sSunderpur%2C%20Uttar%20Pradesh%20231304!5e0!3m2!1sen!2sin!4v1707645000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DigiCraft Office Location"
              ></iframe>
            </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        target={item.target}
                                        href={item.path}
                                        className="text-gray-400 hover:text-teal-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Services</h3>
                        <ul className="space-y-4">
                            {services.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        target="_blank"
                                        className="text-gray-400 hover:text-teal-400 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">
                            Contact Details
                        </h3>
                        <div className="space-y-4">

                            <div>
                                <h4 className="text-teal-400 font-medium mb-2">
                                    Phone Numbers
                                </h4>
                                <div className="space-y-2">
                                    <Link
                                        href="tel:+918299797516"
                                        className="text-gray-400 text-sm flex items-center gap-2">
                                        <FaPhoneAlt />
                                        +91 82997 97516
                                    </Link>
                                    <Link
                                        href="tel:+916203785043"
                                        className="text-gray-400 text-sm flex items-center gap-2">
                                        <FaPhoneAlt />
                                        +91 62037 85043
                                    </Link>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <motion.a
                                    href="https://github.com/digicraft-one"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="text-gray-400 hover:text-teal-400 transition-colors">
                                    <FaGithub size={24} />
                                </motion.a>
                                <motion.a
                                    href="https://www.linkedin.com/company/digicraft-tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="text-gray-400 hover:text-teal-400 transition-colors">
                                    <FaLinkedinIn size={24} />
                                </motion.a>
                                <motion.a
                                    href="https://www.instagram.com/digicraft_technologies"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="text-gray-400 hover:text-teal-400 transition-colors">
                                    <FaInstagram size={24} />
                                </motion.a>
                                <motion.a
                                    href="https://api.whatsapp.com/send/?phone=%2B918299797516&text=Can+I+get+more+information+about+this+%3F&type=phone_number"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="text-gray-400 hover:text-teal-400 transition-colors">
                                    <FaWhatsapp size={24} />
                                </motion.a>
                                <motion.a
                                    href="mailto:hello@digicraft.one"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="text-gray-400 hover:text-teal-400 transition-colors">
                                    <FaEnvelope size={24} />
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>© 2024 DigiCraft Innovation Pvt. Ltd. | All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-teal-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-teal-400 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
