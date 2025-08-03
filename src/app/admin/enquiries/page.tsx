"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAPI } from "@/lib/api";
import { Enquiry } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<
        Record<string, Enquiry["status"]>
    >({});

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const data = await fetchAPI<Enquiry[]>("/enquiries");
                setEnquiries(data);
            } catch (err) {
                console.error("Failed to fetch enquiries:", err);
                setError("Failed to load enquiries");
            } finally {
                setLoading(false);
            }
        };
        fetchEnquiries();
    }, []);

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await fetchAPI(`/enquiries/${id}`, { method: "DELETE" });
            toast.success("Enquiry deleted");
            setEnquiries((prev) => prev?.filter((e) => e._id !== id) || []);
        } catch (err) {
            console.error("Failed to delete enquiry:", err);
            toast.error("Failed to delete enquiry");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id: string, status: Enquiry["status"]) =>
        setNewStatus((prev) => ({ ...prev, [id]: status }));

    const handleSubmitStatus = async (id: string) => {
        const updatedStatus = newStatus[id];
        if (!updatedStatus) return;

        try {
            await fetchAPI(`/enquiries/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: updatedStatus }),
            });
            setEnquiries(
                (prev) =>
                    prev?.map((e) =>
                        e._id === id ? { ...e, status: updatedStatus } : e
                    ) || []
            );
            toast.success("Status updated");
        } catch {
            console.error("Failed to update status");
            toast.error("Failed to update status");
        } finally {
            setEditingId(null);
        }
    };

    if (loading)
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <main className="h-screen w-screen space-y-6 px-4 sm:px-6 lg:px-8 py-6 overflow-y-scroll scrollbar-hidden">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Enquiries</h2>
            </div>

            {enquiries && enquiries.length === 0 ? (
                <div className="text-muted-foreground">No enquiries found.</div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {enquiries?.map((enquiry) => (
                        <Card key={enquiry._id} className="p-2">
                            <CardContent className="px-4 py-2 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            {enquiry.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {enquiry.email}{" "}
                                            {enquiry.phone &&
                                                `• ${enquiry.phone}`}
                                        </p>
                                        <p className="text-sm">
                                            Plan:{" "}
                                            <Badge variant="outline">
                                                {enquiry.adjustmentType}
                                            </Badge>
                                        </p>
                                        <p className="text-sm">
                                            Product:{" "}
                                            <span>
                                                {enquiry?.product?.title}
                                            </span>{" "}
                                            <Badge variant="outline">
                                                {enquiry?.product?.category}
                                            </Badge>
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Created{" "}
                                            {formatDistanceToNow(
                                                new Date(enquiry.createdAt),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </p>
                                        {enquiry.message && (
                                            <p className="text-sm">
                                                {enquiry.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 items-end">
                                        {editingId === enquiry._id ? (
                                            <Select
                                                value={
                                                    newStatus[enquiry._id] ||
                                                    enquiry.status
                                                }
                                                onValueChange={(value) =>
                                                    handleStatusChange(
                                                        enquiry._id,
                                                        value as Enquiry["status"]
                                                    )
                                                }>
                                                <SelectTrigger className="w-[160px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value="contacted">
                                                        Contacted
                                                    </SelectItem>
                                                    <SelectItem value="closed">
                                                        Closed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge
                                                className="capitalize"
                                                variant={
                                                    enquiry.status === "pending"
                                                        ? "secondary"
                                                        : enquiry.status ===
                                                          "contacted"
                                                        ? "default"
                                                        : "outline"
                                                }>
                                                {enquiry.status}
                                            </Badge>
                                        )}

                                        <div className="flex gap-2">
                                            {editingId === enquiry._id ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSubmitStatus(
                                                            enquiry._id
                                                        )
                                                    }
                                                    disabled={loading}>
                                                    Submit Changes
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setEditingId(
                                                            enquiry._id
                                                        )
                                                    }>
                                                    Change Status
                                                </Button>
                                            )}

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive">
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Are you sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will
                                                            permanently delete
                                                            the enquiry.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel
                                                            disabled={loading}>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-600 hover:bg-red-700 text-primary"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    enquiry._id
                                                                )
                                                            }
                                                            disabled={loading}>
                                                            {loading
                                                                ? "Deleting..."
                                                                : "Yes, delete"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
