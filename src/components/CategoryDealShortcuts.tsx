"use client";

import { fetchAPI } from "@/lib/api";
import {
    BookOpen,
    Bot,
    Briefcase,
    LayoutTemplate,
    type LucideIcon,
    Rocket,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

/** Flat tiles — hover only shifts border/background (no transform). */
const TILE_CLASS =
    "group flex flex-col items-center justify-center gap-2 w-[7.25rem] sm:w-32 md:w-36 min-h-[5.5rem] rounded-2xl border border-teal-500/20 bg-slate-900/45 px-3 py-3 text-center shadow-black/20 transition-[border-color,background-color,box-shadow] duration-200 hover:border-teal-400/40 hover:bg-slate-800/65 hover:shadow-md hover:shadow-teal-900/20";

const ICON_CHIP_CLASS =
    "flex h-11 w-11 items-center justify-center rounded-xl border border-teal-500/15 bg-teal-500/10 text-teal-300 transition-[background-color,border-color,color] duration-200 group-hover:border-teal-400/35 group-hover:bg-teal-500/20 group-hover:text-teal-100";

const LABEL_CLASS =
    "text-xs sm:text-sm font-semibold text-white/90 leading-tight line-clamp-2 transition-colors duration-200 group-hover:text-white";

function pickCategoryIcon(slug: string, name: string): LucideIcon {
    const hay = `${slug} ${name}`.toLowerCase();
    if (
        hay.includes("ecommerce") ||
        hay.includes("commerce") ||
        hay.includes("shop") ||
        hay.includes("store") ||
        hay.includes("cart")
    )
        return ShoppingCart;
    if (
        hay.includes("portfolio") ||
        hay.includes("personal") ||
        hay.includes("resume")
    )
        return Briefcase;
    if (hay.includes("blog") || hay.includes("content") || hay.includes("cms"))
        return BookOpen;
    if (
        hay.includes("landing") ||
        hay.includes("page") ||
        hay.includes("saas") ||
        hay.includes("startup")
    )
        return LayoutTemplate;
    if (
        hay.includes("chat") ||
        hay.includes("bot") ||
        hay.includes("ai") ||
        hay.includes("ml")
    )
        return Bot;
    if (hay.includes("mobile") || hay.includes("app") || hay.includes("ios"))
        return Smartphone;
    if (hay.includes("custom") || hay.includes("bespoke"))
        return Sparkles;
    if (hay.includes("offer") || hay.includes("deal") || hay.includes("sale"))
        return Tag;
    if (hay.includes("launch") || hay.includes("rocket"))
        return Rocket;
    return Sparkles;
}

export default function CategoryDealShortcuts() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const list = await fetchAPI<Category[]>("/categories");
                if (!cancelled) setCategories(list);
            } catch {
                if (!cancelled) setCategories([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (!loading && categories.length === 0) return null;

    return (
        <section className="relative overflow-hidden bg-black px-4 pt-8 pb-10 md:pt-10 md:pb-12">
            {/* Same stack as Hot Deals — continuous with hero (black) and section below */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_100%)]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-400">
                        Shop by category
                    </p>
                    <h2 className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                        Jump into deals that fit you
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400 md:text-base">
                        Pick a category to open the marketplace filtered for
                        you—share the link or browse in one tap.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-24 w-28 rounded-2xl border border-teal-500/10 bg-slate-900/40"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:gap-4 md:overflow-visible md:pb-0">
                        {categories.map((category) => {
                            const Icon = pickCategoryIcon(
                                category.slug,
                                category.name
                            );
                            const href = `/products?q=${encodeURIComponent(category.slug)}`;
                            return (
                                <div key={category._id} className="shrink-0">
                                    <Link href={href} className={TILE_CLASS}>
                                        <span className={ICON_CHIP_CLASS}>
                                            <Icon
                                                className="h-5 w-5"
                                                strokeWidth={2}
                                            />
                                        </span>
                                        <span className={LABEL_CLASS}>
                                            {category.name}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                        <div className="shrink-0">
                            <Link href="/products" className={TILE_CLASS}>
                                <span className={ICON_CHIP_CLASS}>
                                    <Rocket
                                        className="h-5 w-5"
                                        strokeWidth={2}
                                    />
                                </span>
                                <span className={LABEL_CLASS}>All deals</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
