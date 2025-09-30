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
import { Application } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Mail,
    MessageSquare,
    Phone,
    Plus,
    Save,
    Tag,
    Trash2,
    User,
    X,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[] | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<{
        status: Record<string, Application["status"]>;
        notes: Record<string, string[]>;
        newNote: Record<string, string>;
    }>({
        status: {},
        notes: {},
        newNote: {},
    });

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await fetchAPI<Application[]>("/applications");
                setApplications(data);

                const status: Record<string, Application["status"]> = {};
                const notes: Record<string, string[]> = {};
                const newNote: Record<string, string> = {};

                data.forEach((apl) => {
                    status[apl._id] = apl.status;
                    notes[apl._id] = apl.notes || [];
                    newNote[apl._id] = "";
                });

                setFormState({ status, notes, newNote });
            } catch (err) {
                console.error("Failed to fetch applications:", err);
                setError("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await fetchAPI(`/applications/${id}`, { method: "DELETE" });
            toast.success("Application deleted successfully");
            setApplications((prev) => prev?.filter((e) => e._id !== id) || []);
        } catch (err) {
            console.error("Failed to delete application:", err);
            toast.error("Failed to delete application");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id: string, status: Application["status"]) => {
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

    const handleRemoveNote = (applicationId: string, noteIndex: number) => {
        setFormState((prev) => {
            const updatedNotes = prev.notes[applicationId].filter(
                (_, i) => i !== noteIndex
            );
            return {
                ...prev,
                notes: { ...prev.notes, [applicationId]: updatedNotes },
            };
        });
    };

    const handleSubmit = async (id: string) => {
        const status = formState.status[id];
        const notes = formState.notes[id];

        if (!status) return;

        try {
            await fetchAPI(`/applications/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status, notes }),
            });

            // Update local applications list
            setApplications(
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
            toast.success("Application updated successfully");
        } catch (err) {
            console.error("Failed to update application:", err);
            toast.error("Failed to update application");
        } finally {
            setEditingId(null);
        }
    };

    const getStatusIcon = (status: Application["status"]) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "selected":
                return <CheckCircle className="w-4 h-4" />;
            case "declined":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: Application["status"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "selected":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "declined":
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
                            <Card
                                key={i}
                                className="rounded-xl border-0 shadow-lg">
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

    if (error)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center text-black">
                <Card className="rounded-xl border-red-200 bg-red-50 p-8 max-w-md">
                    <div className="text-center space-y-4">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 w-fit mx-auto">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-900">
                            Error Loading Applications
                        </h3>
                        <p className="text-red-600">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline">
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
                            Developer Applications
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage and respond to developer applications
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/admin")}
                        variant="outline"
                        className="border-slate-200 text-slate-600 hover:bg-slate-50">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>

                {/* Applications Grid */}
                {applications && applications.length === 0 ? (
                    <Card className="rounded-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-12 text-center">
                            <div className="p-4 rounded-full bg-slate-100 w-fit mx-auto mb-4">
                                <MessageSquare className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                No Applications Found
                            </h3>
                            <p className="text-slate-600">
                                Developer applications will appear here when
                                they apply
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {applications?.map((application) => (
                            <Card
                                key={application._id}
                                className="group overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                                <CardContent className=" space-y-6">
                                    {/* Header: Name, Contact, Status */}
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shrink-0">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-xl text-slate-900 mb-2">
                                                        {application.name}
                                                    </h3>
                                                    <div className="flex gap-6 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    application.email
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 shrink-0" />
                                                            <span>
                                                                {
                                                                    application.phone
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 pl-16 text-black ">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {application.role}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {application.experience}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    Applied{" "}
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            application.createdAt
                                                        ),
                                                        { addSuffix: true }
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>

                                        {editingId === application._id ? (
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-3 py-1.5 shrink-0">
                                                Editing
                                            </Badge>
                                        ) : (
                                            <Badge
                                                className={`capitalize text-xs px-3 py-1.5 border shrink-0 ${getStatusColor(
                                                    application.status
                                                )}`}>
                                                <div className="flex items-center gap-1.5">
                                                    {getStatusIcon(
                                                        application.status
                                                    )}
                                                    {application.status}
                                                </div>
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Location & Availability */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-1 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                Location
                                            </span>
                                            <p className="text-sm text-slate-900 mt-1">
                                                {application.location || "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                Available to Join
                                            </span>
                                            <p className="text-sm text-slate-900 mt-1">
                                                {application.canJoin || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex gap-2 items-center">
                                        <h4 className="text-md font-semibold text-slate-700 uppercase tracking-wide pr-4 ">
                                            Skills
                                        </h4>
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-800 px-3 py-1.5">
                                            {application.primarySkills || "—"}
                                        </Badge>
                                        {application.secondarySkills && (
                                            <Badge
                                                variant="outline"
                                                className="text-slate-700 px-3 py-1.5">
                                                {application.secondarySkills}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-2 mb-10">
                                        <h4 className="text-md font-semibold text-slate-700 uppercase tracking-wide mr-6">
                                            Links
                                        </h4>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="p-0 h-auto text-green-600 hover:text-green-800 font-medium"
                                            asChild>
                                            <a
                                                href={application.resume}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                Resume →
                                            </a>
                                        </Button>
                                        {application.github && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium"
                                                asChild>
                                                <a
                                                    href={application.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    GitHub →
                                                </a>
                                            </Button>
                                        )}
                                        {application.linkedin && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium"
                                                asChild>
                                                <a
                                                    href={application.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    LinkedIn →
                                                </a>
                                            </Button>
                                        )}
                                        {application.portfolio && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium"
                                                asChild>
                                                <a
                                                    href={application.portfolio}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    Portfolio →
                                                </a>
                                            </Button>
                                        )}
                                    </div>

                                    {/* Cover Letter */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                                            <MessageSquare className="w-4 h-4" />
                                            Cover Letter
                                        </h4>
                                        <div className="text-sm bg-slate-50 px-5 py-2 rounded-xl border border-slate-200">
                                            <ScrollArea className="max-h-40">
                                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                                    {application.coverLetter}
                                                </p>
                                            </ScrollArea>
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                            Notes
                                        </h4>
                                        {editingId === application._id ? (
                                            <div className="space-y-3">
                                                <ScrollArea className="max-h-40 border border-slate-200 rounded-xl p-4 bg-slate-50">
                                                    {formState.notes[
                                                        application._id
                                                    ]?.length ? (
                                                        <ul className="space-y-2">
                                                            {formState.notes[
                                                                application._id
                                                            ].map(
                                                                (note, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="text-sm flex justify-between items-start gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                                        <span className="text-slate-700 leading-relaxed flex-1">
                                                                            {
                                                                                note
                                                                            }
                                                                        </span>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleRemoveNote(
                                                                                    application._id,
                                                                                    idx
                                                                                )
                                                                            }
                                                                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-slate-400 text-center py-8">
                                                            No notes yet. Add
                                                            one below.
                                                        </p>
                                                    )}
                                                </ScrollArea>

                                                <div className="flex gap-2 text-black">
                                                    <Input
                                                        placeholder="Add a note..."
                                                        value={
                                                            formState.newNote[
                                                                application._id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            setFormState(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    newNote: {
                                                                        ...prev.newNote,
                                                                        [application._id]:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                })
                                                            )
                                                        }
                                                        onKeyPress={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                handleAddNote(
                                                                    application._id
                                                                );
                                                            }
                                                        }}
                                                        className="flex-1 h-11"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleAddNote(
                                                                application._id
                                                            )
                                                        }
                                                        type="button"
                                                        className="bg-blue-600 hover:bg-blue-700 h-11 px-4">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                                <ScrollArea className="max-h-32">
                                                    {application.notes &&
                                                    application.notes.length >
                                                        0 ? (
                                                        <ul className="space-y-2 text-sm">
                                                            {application.notes.map(
                                                                (note, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                                                                        {note}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-slate-400 text-center py-6">
                                                            No notes yet.
                                                        </p>
                                                    )}
                                                </ScrollArea>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 pt-6 border-t-2 border-slate-100">
                                        {editingId === application._id ? (
                                            <div className="space-y-4">
                                                <Select
                                                    value={
                                                        formState.status[
                                                            application._id
                                                        ]
                                                    }
                                                    onValueChange={(value) =>
                                                        handleStatusChange(
                                                            application._id,
                                                            value as Application["status"]
                                                        )
                                                    }>
                                                    <SelectTrigger className="w-full text-black h-11 rounded-xl">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="text-black bg-slate-50 rounded-xl">
                                                        <SelectItem value="pending">
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value="selected">
                                                            Selected
                                                        </SelectItem>
                                                        <SelectItem value="declined">
                                                            Declined
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <div className="flex gap-3">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleSubmit(
                                                                application._id
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 h-11 rounded-xl font-medium">
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setEditingId(null)
                                                        }
                                                        disabled={loading}
                                                        className="border-slate-300 text-slate-700 hover:bg-slate-50 h-11 px-6 rounded-xl font-medium">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setEditingId(
                                                            application._id
                                                        )
                                                    }
                                                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 h-11 rounded-xl font-medium">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-11 px-5 rounded-xl font-medium">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-2xl bg-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-slate-900 text-xl">
                                                                Delete
                                                                Application
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-slate-600 text-base">
                                                                Are you sure you
                                                                want to delete
                                                                this
                                                                application?
                                                                This action
                                                                cannot be
                                                                undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="border-slate-200 text-black rounded-xl">
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700 rounded-xl"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        application._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }>
                                                                Delete
                                                                Application
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
