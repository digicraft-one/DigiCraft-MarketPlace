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
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminEnquiriesPage() {
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
            toast.success("Enquiry deleted");
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
            toast.success("Enquiry updated");
        } catch (err) {
            console.error("Failed to update enquiry:", err);
            toast.error("Failed to update enquiry");
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enquiries?.map((enquiry) => (
                        <Card key={enquiry._id} className="p-2 shadow-sm">
                            <CardContent className="px-4 py-3 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">
                                            {enquiry.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {enquiry.email}{" "}
                                            {enquiry.phone &&
                                                `• ${enquiry.phone}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Created{" "}
                                            {formatDistanceToNow(
                                                new Date(enquiry.createdAt),
                                                { addSuffix: true }
                                            )}
                                        </p>
                                    </div>

                                    {editingId === enquiry._id ? (
                                        <Badge
                                            variant="destructive"
                                            className="text-xs px-2 py-1"
                                            onClick={() => setEditingId(null)}>
                                            Editing
                                        </Badge>
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
                                </div>

                                <div className="text-sm">
                                    <p>
                                        <strong>Plan:</strong>{" "}
                                        <Badge variant="outline">
                                            {enquiry.adjustmentType}
                                        </Badge>
                                    </p>
                                    <p>
                                        <strong>Product:</strong>{" "}
                                        <span>{enquiry?.product?.title}</span>{" "}
                                        <Badge variant="outline">
                                            {enquiry?.product?.category}
                                        </Badge>
                                    </p>
                                </div>

                                {enquiry.message && (
                                    <>
                                        <strong className="text-sm">
                                            Message:
                                        </strong>
                                        <div className="text-sm bg-secondary p-2 rounded-md border">
                                            <p className="mt-1">
                                                {enquiry.message}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Notes Section */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">
                                        Notes
                                    </h4>
                                    {editingId === enquiry._id ? (
                                        <>
                                            <ScrollArea className="max-h-32 border rounded-md p-2 bg-secondary">
                                                {formState.notes[enquiry._id]
                                                    ?.length ? (
                                                    <ul className="space-y-1">
                                                        {formState.notes[
                                                            enquiry._id
                                                        ].map((note, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-sm flex justify-between items-start bg-secondary p-2 rounded">
                                                                <span>
                                                                    {note}
                                                                </span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleRemoveNote(
                                                                            enquiry._id,
                                                                            idx
                                                                        )
                                                                    }
                                                                    className="ml-2 h-6 w-6 p-0">
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-gray-400">
                                                        No notes yet.
                                                    </p>
                                                )}
                                            </ScrollArea>

                                            <div className="flex gap-1">
                                                <Input
                                                    placeholder="Add a note..."
                                                    value={
                                                        formState.newNote[
                                                            enquiry._id
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setFormState(
                                                            (prev) => ({
                                                                ...prev,
                                                                newNote: {
                                                                    ...prev.newNote,
                                                                    [enquiry._id]:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleAddNote(
                                                                enquiry._id
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleAddNote(
                                                            enquiry._id
                                                        )
                                                    }
                                                    type="button">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <ScrollArea className="max-h-24 border rounded-md p-2 bg-secondary">
                                            {enquiry.notes &&
                                            enquiry.notes.length > 0 ? (
                                                <ul className="space-y-1 text-sm">
                                                    {enquiry.notes.map(
                                                        (note, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="p-1 border-b last:border-b-0">
                                                                {note}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="text-xs text-gray-400">
                                                    No notes.
                                                </p>
                                            )}
                                        </ScrollArea>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 pt-2">
                                    {editingId === enquiry._id ? (
                                        <div className="space-y-2">
                                            <Select
                                                value={
                                                    formState.status[
                                                        enquiry._id
                                                    ]
                                                }
                                                onValueChange={(value) =>
                                                    handleStatusChange(
                                                        enquiry._id,
                                                        value as Enquiry["status"]
                                                    )
                                                }>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
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

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSubmit(
                                                            enquiry._id
                                                        )
                                                    }
                                                    disabled={loading}>
                                                    Save Changes
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                    disabled={loading}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setEditingId(enquiry._id)
                                                }>
                                                Edit
                                            </Button>
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
                                                            Confirm Deletion
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will
                                                            permanently delete
                                                            this enquiry. This
                                                            action cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel
                                                            disabled={loading}>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-600 hover:bg-red-700"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    enquiry._id
                                                                )
                                                            }
                                                            disabled={loading}>
                                                            {loading
                                                                ? "Deleting..."
                                                                : "Yes, Delete"}
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
    );
}
