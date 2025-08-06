"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";

const navItems = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Offers", path: "/offers" },
    { name: "FAQ", path: "/faq" },
];
const productDropdownItems = [
    {
        name: "Digicraft Tech",
        href: "https://digicraft.one",
        logo: "https://www.digicraft.one/logo.svg",
    },
    {
        name: "Dbdash",
        href: "https://dbdash.live",
        logo: "https://www.dbdash.live/logo_noBg.png",
    },
    {
        name: "Digicraft Media",
        href: "https://media.digicraft.one",
        logo: "https://media.digicraft.one/logo.svg",
    },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (path: string) => {
        setIsOpen(false);
        if (path === "/contact") {
            router.push("/contact");
        } else if (path.startsWith("/#")) {
            const element = document.querySelector(path.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        if (path.startsWith("/#")) return false;
        return pathname.startsWith(path);
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const productButtonRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-black/80 backdrop-blur-md py-2"
                    : "bg-transparent py-6"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold">
                            <Image
                                src="/logo.svg"
                                alt="DigiCraft"
                                width={60}
                                height={60}
                                className="h-16 w-auto"
                            />
                        </Link>
                        <div className="relative">
                            <div
                                onClick={() =>
                                    setIsDropdownOpen((prev) => !prev)
                                }
                                ref={productButtonRef}>
                                <button
                                    id="product-button"
                                    title="Others"
                                    className="md:flex cursor-pointer hidden items-center justify-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 py-1 px-3 rounded-full transition-all text-sm">
                                    Others{" "}
                                    {isDropdownOpen ? (
                                        <ChevronDownIcon className="rotate-180 transition-transform duration-300" />
                                    ) : (
                                        <ChevronDownIcon className="transition-transform duration-300" />
                                    )}
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute left-0 mt-2 w-44 rounded-md shadow-lg bg-black/90 backdrop-blur-md border border-white/20 z-50">
                                    <ul className="py-1">
                                        {productDropdownItems.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded mx-1"
                                                    style={{
                                                        minHeight: "36px",
                                                    }}
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }>
                                                    <img
                                                        src={item.logo}
                                                        alt={
                                                            item.name + " logo"
                                                        }
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => handleNavClick(item.path)}
                                className={`relative group ${
                                    isActive(item.path)
                                        ? "text-teal-400"
                                        : "text-gray-300"
                                }`}>
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                        <button
                            onClick={() => router.push("/contact")}
                            className="cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                            Let&apos;s Talk
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}>
                        <div
                            className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${
                                isOpen
                                    ? "transform rotate-45 translate-y-2"
                                    : ""
                            }`}
                        />
                        <div
                            className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${
                                isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <div
                            className={`w-6 h-0.5 bg-white transition-all ${
                                isOpen
                                    ? "transform -rotate-45 -translate-y-2"
                                    : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/90 backdrop-blur-md">
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => handleNavClick(item.path)}
                                    className={`block py-2 ${
                                        isActive(item.path)
                                            ? "text-teal-400"
                                            : "text-gray-300"
                                    } hover:text-teal-400 transition-colors`}>
                                    {item.name}
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/contact");
                                }}
                                className="block w-full text-left py-2 text-teal-400 hover:text-teal-300 transition-colors">
                                Let&apos;s Talk
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
