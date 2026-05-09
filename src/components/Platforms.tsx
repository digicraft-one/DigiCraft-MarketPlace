"use client";

import { motion } from "framer-motion";
import {
    ChatBubbleLeftRightIcon,
    CloudIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    DeviceTabletIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const platforms: {
    id: number;
    name: string;
    icon: IconComponent;
    description: string;
    color: string;
}[] = [
    {
        id: 1,
        name: "Web Applications",
        icon: GlobeAltIcon,
        description:
            "Responsive web apps that run smoothly in every browser, tuned for speed, SEO, and a polished user experience.",
        color: "from-teal-500 to-cyan-500",
    },
    {
        id: 2,
        name: "Chatbots",
        icon: ChatBubbleLeftRightIcon,
        description:
            "Conversational assistants and support bots that plug into your site or channels—trained flows, handoffs, and analytics-ready.",
        color: "from-cyan-500 to-blue-500",
    },
    {
        id: 3,
        name: "Cloud & APIs",
        icon: CloudIcon,
        description:
            "Secure integrations with AWS, Azure, or custom backends—REST, webhooks, and data pipelines your products can rely on.",
        color: "from-blue-500 to-indigo-500",
    },
    {
        id: 4,
        name: "Android Apps",
        icon: DevicePhoneMobileIcon,
        description:
            "Native Android experiences with Material Design, offline modes, push notifications, and Play Store–ready builds.",
        color: "from-indigo-500 to-violet-500",
    },
    {
        id: 5,
        name: "iOS Applications",
        icon: DeviceTabletIcon,
        description:
            "iPhone and iPad apps aligned with Apple HIG, iCloud where it helps, and App Store–friendly release workflows.",
        color: "from-violet-500 to-teal-500",
    },
    {
        id: 6,
        name: "Desktop Applications",
        icon: ComputerDesktopIcon,
        description:
            "Cross-platform desktop software for Windows, macOS, and Linux—with updates, system hooks, and offline-first when you need it.",
        color: "from-teal-500 to-sky-500",
    },
];

interface PlatformCardProps {
    name: string;
    icon: IconComponent;
    description: string;
    color: string;
    index: number;
}

const PlatformCard = ({
    name,
    icon: Icon,
    description,
    color,
    index,
}: PlatformCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        className="group flex h-full w-full flex-col rounded-2xl border border-teal-500/20 bg-gradient-to-br from-slate-900/55 to-slate-900/25 p-5 shadow-black/10 transition-[border-color,background-color,box-shadow] duration-200 hover:border-teal-400/35 hover:bg-slate-800/40 hover:shadow-md hover:shadow-teal-900/15">
        <div
            className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-2 text-lg font-bold leading-snug text-white">{name}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </motion.div>
);

/**
 * Single 3×3 grid (like reference):
 *   [ Title ] [ · ] [ Web ]
 *   [   ·   ] [Chat] [Cloud]
 *   [ And   ] [iOS] [Desk]
 */
const PLATFORM_GRID: {
    platform: (typeof platforms)[number];
    index: number;
    cell: string;
}[] = [
    {
        platform: platforms[0],
        index: 0,
        cell: "lg:col-start-3 lg:row-start-1 lg:self-start",
    },
    {
        platform: platforms[1],
        index: 1,
        cell: "lg:col-start-2 lg:row-start-2",
    },
    {
        platform: platforms[2],
        index: 2,
        cell: "lg:col-start-3 lg:row-start-2",
    },
    {
        platform: platforms[3],
        index: 3,
        cell: "lg:col-start-1 lg:row-start-3",
    },
    {
        platform: platforms[4],
        index: 4,
        cell: "lg:col-start-2 lg:row-start-3",
    },
    {
        platform: platforms[5],
        index: 5,
        cell: "lg:col-start-3 lg:row-start-3",
    },
];

const Platforms = () => {
    return (
        <section className="relative overflow-hidden px-4 py-20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black to-slate-900/50" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />

            <div className="relative mx-auto max-w-7xl">
                {/* One grid: heading at (1,1) = top-left; cards form the stair; gaps = empty cells */}
                <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-8 sm:max-w-lg sm:gap-9 lg:max-w-none lg:grid-cols-3 lg:grid-rows-3 lg:items-stretch lg:gap-x-5 lg:gap-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="lg:col-start-1 lg:row-start-1 lg:self-start lg:pr-2">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-400">
                            Ecosystem
                        </p>
                        <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
                            Platforms We Support
                        </h2>
                        <p className="max-w-md text-base leading-relaxed text-gray-400">
                            From chatbots to the cloud—one team across web,
                            mobile, and desktop so your product ships everywhere
                            your users are.
                        </p>
                    </motion.div>

                    {PLATFORM_GRID.map(({ platform, index, cell }) => (
                        <div
                            key={platform.id}
                            className={`${cell} mx-auto flex h-full w-full max-w-md lg:mx-0 lg:max-w-none`}>
                            <PlatformCard
                                name={platform.name}
                                icon={platform.icon}
                                description={platform.description}
                                color={platform.color}
                                index={index}
                            />
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-16 text-center">
                    <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-slate-900/50 to-transparent p-8 backdrop-blur-sm">
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            Need a Custom Solution?
                        </h3>
                        <p className="mx-auto mb-6 max-w-2xl text-gray-400">
                            We also specialize in custom development for
                            specific platforms and requirements. Let&apos;s
                            discuss your unique needs and create a tailored
                            solution.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={"https://www.digicraft.one/pricing"}
                                target="_blank">
                                <button className="cursor-pointer rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-4 font-semibold text-white transition-all hover:shadow-lg hover:shadow-teal-500/25">
                                    Get Custom Quote
                                </button>
                            </Link>
                            <Link
                                href={"https://www.digicraft.one/contact"}
                                target="_blank">
                                <button className="cursor-pointer rounded-full border border-teal-400 px-8 py-4 font-semibold text-teal-400 transition-all hover:bg-teal-500/10">
                                    Schedule Consultation
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Platforms;
