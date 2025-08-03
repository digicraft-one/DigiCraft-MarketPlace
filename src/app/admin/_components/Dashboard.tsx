import LogoutButton from "@/components/shared/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAPI } from "@/lib/api";
import { EnquiryDocument } from "@/schemas/Enquiry";
import { OfferDocument } from "@/schemas/Offer";
import { ProductDocument } from "@/schemas/Product";
import Link from "next/link";
import { Suspense } from "react";

export default function AdminDashboardPage() {
    return (
        <main className="px-4 sm:px-6 lg:px-8 py-6 w-screen h-screen space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <LogoutButton />
            </div>
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardStats />
            </Suspense>
        </main>
    );
}

export function DashboardCard({
    title,
    count,
    linkTo,
}: {
    title: string;
    count: number;
    linkTo: string;
}) {
    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
                <CardTitle className="text-md text-muted-foreground font-medium">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-foreground flex justify-between items-center">
                <span>{count}</span>
                <Link href={linkTo}>
                    <Button variant="default" size="sm">
                        View
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card
                    key={i}
                    className="rounded-2xl border shadow-sm p-6 space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
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
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <DashboardCard
                    title="Total Products"
                    count={products.length}
                    linkTo="admin/products"
                />
                <DashboardCard
                    title="Total Offers"
                    count={offers.length}
                    linkTo="admin/offers"
                />
                <DashboardCard
                    title="Total Enquiries"
                    count={enquiries.length}
                    linkTo="admin/enquiries"
                />
            </div>
        );
    } catch {
        return (
            <p className="text-red-500 font-medium">
                Error loading dashboard metrics. Check server/API logs.
            </p>
        );
    }
}
