"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {

  const quickLinks = [
    { target: "_self", name: "About", path: "/about" },
    { target: "_self", name: "Marketplace", path: "/marketplace" },
    { target: "_self", name: "Offers", path: "/offers" },
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
  ];

  const services = [
    {
      name: "Web Development",
      path: "https://www.digicraft.one/services#web-development",
    },
    {
      name: "Mobile Apps",
      path: "https://www.digicraft.one/services#mobile-apps",
    },
    {
      name: "UI/UX Design",
      path: "https://www.digicraft.one/services#ui-ux-design",
    },
    {
      name: "Cloud Solutions",
      path: "https://www.digicraft.one/services#cloud-solutions",
    },
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
            <p className="text-gray-400 mb-6">
              Crafting digital experiences that inspire, innovate,
              and impact.
            </p>
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
                href="https://www.linkedin.com/company/digicraft-one"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-teal-400 transition-colors">
                <FaLinkedinIn size={24} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/digicraft.one/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-teal-400 transition-colors">
                <FaInstagram size={24} />
              </motion.a>
              <motion.a
                href="https://chat.whatsapp.com/LsdAmwogrUkB2cNQ7MWKtQ"
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
                <h4 className="text-teal-400 font-medium mb-2">Address</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  123 Digital Street,
                  Tech District,
                  Silicon Valley, CA 94025,
                  United States
                </p>
              </div>
              <div>
                <h4 className="text-teal-400 font-medium mb-2">Phone Numbers</h4>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">
                    +1 (555) 123-4567
                  </p>
                  <p className="text-gray-400 text-sm">
                    +1 (555) 987-6543
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2024 DigiCraft. All rights reserved.</p>
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
