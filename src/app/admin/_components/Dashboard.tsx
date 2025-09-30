import LogoutButton from "@/components/shared/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAPI } from "@/lib/api";
import { EnquiryDocument } from "@/schemas/Enquiry";
import { OfferDocument } from "@/schemas/Offer";
import { ProductDocument } from "@/schemas/Product";
import {
    BarChart3,
    FileUser,
    MessageSquare,
    Package,
    Tag,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage your marketplace and track performance
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            System Online
                        </div>
                        <LogoutButton />
                    </div>
                </div>

                {/* Stats Grid */}
                <Suspense fallback={<DashboardSkeleton />}>
                    <DashboardStats />
                </Suspense>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickActionCard
                        title="Add Product"
                        description="Create a new product listing"
                        icon={<Package className="w-6 h-6" />}
                        href="/admin/products/new"
                        gradient="from-blue-500 to-cyan-500"
                        isExternal={false}
                    />
                    <QuickActionCard
                        title="View Enquiries"
                        description="Check customer inquiries"
                        icon={<MessageSquare className="w-6 h-6" />}
                        href="/admin/enquiries"
                        gradient="from-green-500 to-emerald-500"
                        isExternal={false}
                    />
                    <QuickActionCard
                        title="View Applications"
                        description="Check applications"
                        icon={<FileUser className="w-6 h-6" />}
                        href="/admin/applications"
                        gradient="from-yellow-500 to-amber-500"
                        isExternal={false}
                    />
                    <QuickActionCard
                        title="Manage Offers"
                        description="Update promotional offers"
                        icon={<Tag className="w-6 h-6" />}
                        href="/admin/offers"
                        gradient="from-purple-500 to-pink-500"
                        isExternal={false}
                    />
                    <QuickActionCard
                        title="Analytics"
                        description="View performance metrics"
                        icon={<BarChart3 className="w-6 h-6" />}
                        href="https://analytics.google.com"
                        gradient="from-orange-500 to-red-500"
                        isExternal={true}
                    />
                </div>
            </main>
        </div>
    );
}

export function DashboardCard({
    title,
    count,
    linkTo,
    icon,
    trend,
    trendValue,
}: {
    title: string;
    count: number;
    linkTo: string;
    icon?: React.ReactNode;
    trend?: "up" | "down";
    trendValue?: string;
}) {
    return (
        <Card className="group relative overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        {title}
                    </CardTitle>
                    {icon && (
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            {icon}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative pt-0">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <div className="text-3xl font-bold text-slate-900">
                            {count.toLocaleString()}
                        </div>
                        {trend && trendValue && (
                            <div
                                className={`flex items-center gap-1 text-sm ${
                                    trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}>
                                <TrendingUp
                                    className={`w-4 h-4 ${
                                        trend === "down" ? "rotate-180" : ""
                                    }`}
                                />
                                {trendValue}
                            </div>
                        )}
                    </div>
                    <Link href={linkTo}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                            View All
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickActionCard({
    title,
    description,
    icon,
    href,
    gradient,
    isExternal,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    gradient: string;
    isExternal: boolean;
}) {
    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block">
                <Card className="group cursor-pointer overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <CardContent className="relative p-6">
                        <div className="flex items-center gap-4">
                            <div
                                className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                                {icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {title}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </a>
        );
    }

    return (
        <Link href={href}>
            <Card className="group cursor-pointer overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <CardContent className="relative p-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                            {icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {title}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function DashboardSkeleton() {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card
                    key={i}
                    className="rounded-xl border-0 shadow-lg p-6 space-y-4 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </Card>
            ))}
        </div>
    );
}

async function DashboardStats() {
    try {
        const [products, offers, enquiries] = await Promise.all([
            fetchAPI<ProductDocument[]>("/products"),
            fetchAPI<OfferDocument[]>("/offers"),
            fetchAPI<EnquiryDocument[]>("/enquiries"),
        ]);

        return (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardCard
                    title="Total Products"
                    count={products.length}
                    linkTo="admin/products"
                    icon={<Package className="w-5 h-5" />}
                    trend="up"
                    trendValue="+12% this month"
                />
                <DashboardCard
                    title="Active Offers"
                    count={offers.length}
                    linkTo="admin/offers"
                    icon={<Tag className="w-5 h-5" />}
                    trend="up"
                    trendValue="+5% this week"
                />
                <DashboardCard
                    title="New Enquiries"
                    count={enquiries.length}
                    linkTo="admin/enquiries"
                    icon={<MessageSquare className="w-5 h-5" />}
                    trend="up"
                    trendValue="+8% today"
                />
            </div>
        );
    } catch {
        return (
            <Card className="rounded-xl border-red-200 bg-red-50 p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 text-red-600">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900">
                            Error Loading Metrics
                        </h3>
                        <p className="text-sm text-red-600">
                            Check server/API logs for details
                        </p>
                    </div>
                </div>
            </Card>
        );
    }
}
