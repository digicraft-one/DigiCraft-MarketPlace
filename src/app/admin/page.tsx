import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import AdminDashboard from "./_components/Dashboard";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.name !== "Admin") return redirect("/login");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <AdminDashboard />
        </div>
    );
}
