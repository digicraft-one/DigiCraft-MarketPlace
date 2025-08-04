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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Plus, X, ArrowLeft, MessageSquare, User, Phone, Mail, Calendar, Package, Tag, Edit, Trash2, Save, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminEnquiriesPage() {
    const router = useRouter();
    const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<{
        status: Record<string, Enquiry["status"]>;
        notes: Record<string, string[]>;
        newNote: Record<string, string>;
    }>({
        status: {},
        notes: {},
        newNote: {},
    });

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const data = await fetchAPI<Enquiry[]>("/enquiries");
                setEnquiries(data);

                const status: Record<string, Enquiry["status"]> = {};
                const notes: Record<string, string[]> = {};
                const newNote: Record<string, string> = {};

                data.forEach((enq) => {
                    status[enq._id] = enq.status;
                    notes[enq._id] = enq.notes || [];
                    newNote[enq._id] = "";
                });

                setFormState({ status, notes, newNote });
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
            toast.success("Enquiry deleted successfully");
            setEnquiries((prev) => prev?.filter((e) => e._id !== id) || []);
        } catch (err) {
            console.error("Failed to delete enquiry:", err);
            toast.error("Failed to delete enquiry");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id: string, status: Enquiry["status"]) => {
        setFormState((prev) => ({
            ...prev,
            status: { ...prev.status, [id]: status },
        }));
    };

    const handleAddNote = (id: string) => {
        const note = formState.newNote[id]?.trim();
        if (!note) return;

        setFormState((prev) => {
            const updatedNotes = [...(prev.notes[id] || []), note];
            return {
                ...prev,
                notes: { ...prev.notes, [id]: updatedNotes },
                newNote: { ...prev.newNote, [id]: "" },
            };
        });
    };

    const handleRemoveNote = (enquiryId: string, noteIndex: number) => {
        setFormState((prev) => {
            const updatedNotes = prev.notes[enquiryId].filter(
                (_, i) => i !== noteIndex
            );
            return {
                ...prev,
                notes: { ...prev.notes, [enquiryId]: updatedNotes },
            };
        });
    };

    const handleSubmit = async (id: string) => {
        const status = formState.status[id];
        const notes = formState.notes[id];

        if (!status) return;

        try {
            await fetchAPI(`/enquiries/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status, notes }),
            });

            // Update local enquiries list
            setEnquiries(
                (prev) =>
                    prev?.map((e) =>
                        e._id === id
                            ? {
                                  ...e,
                                  status,
                                  notes,
                              }
                            : e
                    ) || []
            );
            toast.success("Enquiry updated successfully");
        } catch (err) {
            console.error("Failed to update enquiry:", err);
            toast.error("Failed to update enquiry");
        } finally {
            setEditingId(null);
        }
    };

    const getStatusIcon = (status: Enquiry["status"]) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "contacted":
                return <CheckCircle className="w-4 h-4" />;
            case "closed":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: Enquiry["status"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "contacted":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "closed":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-black">
                <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="rounded-xl border-0 shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-16" />
                                        <Skeleton className="h-8 w-16" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center text-black">
            <Card className="rounded-xl border-red-200 bg-red-50 p-8 max-w-md">
                <div className="text-center space-y-4">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 w-fit mx-auto">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-900">Error Loading Enquiries</h3>
                    <p className="text-red-600">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Try Again
                    </Button>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Customer Enquiries
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage and respond to customer inquiries
                        </p>
                    </div>
                    <Button 
                        onClick={() => router.push("/admin")}
                        variant="outline"
                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>

                {/* Enquiries Grid */}
                {enquiries && enquiries.length === 0 ? (
                    <Card className="rounded-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-12 text-center">
                            <div className="p-4 rounded-full bg-slate-100 w-fit mx-auto mb-4">
                                <MessageSquare className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Enquiries Found</h3>
                            <p className="text-slate-600">Customer inquiries will appear here when they contact you</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {enquiries?.map((enquiry) => (
                            <Card key={enquiry._id} className="group overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-6 space-y-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-slate-900">
                                                        {enquiry.name}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {enquiry.email}
                                                        </div>
                                                        {enquiry.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                {enquiry.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                Created {formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>

                                        {editingId === enquiry._id ? (
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1">
                                                Editing
                                            </Badge>
                                        ) : (
                                            <Badge className={`capitalize text-xs px-3 py-1 border ${getStatusColor(enquiry.status)}`}>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(enquiry.status)}
                                                    {enquiry.status}
                                                </div>
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Product & Plan Info */}
                                    <div className="space-y-3 p-4 rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm font-medium text-slate-700">Product:</span>
                                            <span className="text-sm text-slate-600">{enquiry?.product?.title}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {enquiry?.product?.category}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm font-medium text-slate-700">Plan:</span>
                                            <Badge variant="outline" className="text-xs">
                                                {enquiry.adjustmentType}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {enquiry.message && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Message
                                            </h4>
                                            <div className="text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <p className="text-slate-700 leading-relaxed">
                                                    {enquiry.message}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes Section */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-700">Notes</h4>
                                        {editingId === enquiry._id ? (
                                            <>
                                                <ScrollArea className="max-h-32 border rounded-lg p-3 bg-slate-50">
                                                    {formState.notes[enquiry._id]?.length ? (
                                                        <ul className="space-y-2">
                                                            {formState.notes[enquiry._id].map((note, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="text-sm flex justify-between items-start bg-white p-3 rounded-lg border border-slate-200">
                                                                    <span className="text-slate-700">
                                                                        {note}
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveNote(enquiry._id, idx)}
                                                                        className="ml-2 h-6 w-6 p-0 text-slate-400 hover:text-red-500">
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 text-center py-4">
                                                            No notes yet.
                                                        </p>
                                                    )}
                                                </ScrollArea>

                                                <div className="flex gap-2 text-black border-t border-slate-200 pt-3">
                                                    <Input
                                                        placeholder="Add a note..."
                                                        value={formState.newNote[enquiry._id] || ""}
                                                        onChange={(e) =>
                                                            setFormState((prev) => ({
                                                                ...prev,
                                                                newNote: {
                                                                    ...prev.newNote,
                                                                    [enquiry._id]: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleAddNote(enquiry._id);
                                                            }
                                                        }}
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAddNote(enquiry._id)}
                                                        type="button"
                                                        className="bg-blue-600 hover:bg-blue-700">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <ScrollArea className="max-h-24 border rounded-lg p-3 bg-slate-50">
                                                {enquiry.notes && enquiry.notes.length > 0 ? (
                                                    <ul className="space-y-2 text-sm">
                                                        {enquiry.notes.map((note, idx) => (
                                                            <li key={idx} className="p-2 bg-white rounded border border-slate-200 text-slate-700">
                                                                {note}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-slate-400 text-center py-4">
                                                        No notes.
                                                    </p>
                                                )}
                                            </ScrollArea>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                                        {editingId === enquiry._id ? (
                                            <div className="space-y-3">
                                                <Select
                                                    value={formState.status[enquiry._id]}
                                                    onValueChange={(value) =>
                                                        handleStatusChange(enquiry._id, value as Enquiry["status"])
                                                    }>
                                                    <SelectTrigger className="w-full text-black">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="text-black bg-slate-50">
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="contacted">Contacted</SelectItem>
                                                        <SelectItem value="closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSubmit(enquiry._id)}
                                                        disabled={loading}
                                                        className="bg-green-600 hover:bg-green-700">
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingId(null)}
                                                        disabled={loading}
                                                        className="border-slate-200 text-slate-600 hover:bg-slate-50">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingId(enquiry._id)}
                                                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-xl bg-slate-50">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-slate-900">Delete Enquiry</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-slate-600">
                                                                Are you sure you want to delete this enquiry? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="border-slate-200 text-black">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => handleDelete(enquiry._id)}
                                                                disabled={loading}>
                                                                Delete Enquiry
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
