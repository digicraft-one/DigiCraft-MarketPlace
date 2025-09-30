"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchAPI } from "@/lib/api";
import { ApplicationRoles, ExperienceLevel } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFileCode, FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";

const ROLE_OPTIONS: { value: ApplicationRoles; label: string }[] = [
    { value: "fullstack", label: "Full Stack Developer" },
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "app", label: "App Developer" },
    { value: "ai-ml", label: "AI/ML Engineer" },
    { value: "devops", label: "DevOps Engineer" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
    { value: "junior", label: "Junior (0-2 years)" },
    { value: "mid", label: "Mid-Level (2-5 years)" },
    { value: "senior", label: "Senior (5+ years)" },
    { value: "lead", label: "Lead/Architect (8+ years)" },
];

const REQUIRED_FIELDS: Record<number, (keyof FormData)[]> = {
    0: ["name", "email", "phone", "location"],
    1: ["role", "experience", "primarySkills", "resume"],
    2: ["canJoin", "coverLetter"],
};

interface FormData {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: string;
    experience: string;
    primarySkills: string;
    secondarySkills: string;
    github: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    canJoin: string;
    coverLetter: string;
}

export default function ApplicationForm() {
    const router = useRouter();
    const DEFAULT_VALUES: FormData = {
        name: "",
        email: "",
        phone: "",
        location: "",
        role: "",
        experience: "",
        primarySkills: "",
        secondarySkills: "",
        github: "",
        linkedin: "",
        portfolio: "",
        resume: "",
        canJoin: "",
        coverLetter: "",
    };

    const [currentSection, setCurrentSection] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [touchedSections, setTouchedSections] = useState<Set<number>>(
        new Set()
    );
    const [formData, setFormData] = useState<FormData>(DEFAULT_VALUES);

    const handleChange = <K extends keyof FormData>(
        field: K,
        value: FormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouchedSections(new Set(sections.map((_, i) => i)));

        if (!validateAllSections()) {
            toast.error("Please complete all required fields.");
            const firstInvalid = sections.findIndex(
                (_, i) => !validateSection(i)
            );
            if (firstInvalid !== -1) setCurrentSection(firstInvalid);
            return;
        }

        setLoading(true);

        try {
            await fetchAPI("/applications", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            toast.success("Application submitted. We'll contact you soon.");

            setFormData(DEFAULT_VALUES);
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Submission failed";
            setError(message);
            console.error(err);
            toast.error("Submission failed. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    const isFieldInvalid = (field: keyof FormData): boolean =>
        touchedSections.has(currentSection) &&
        REQUIRED_FIELDS[currentSection]?.includes(field) &&
        formData[field].trim() === "";

    const validateSection = (sectionIndex: number): boolean => {
        const fields = REQUIRED_FIELDS[sectionIndex];
        if (!fields) return true;

        for (const field of fields) {
            const value = formData[field];
            if (value === "" || value.trim() === "") return false;
        }
        return true;
    };

    const validateAllSections = (): boolean =>
        sections.every((_, index) => validateSection(index));

    const InputFieldClassName = (fieldName: keyof FormData) =>
        `bg-[#0a0f1c]/60 text-white placeholder:text-gray-600 rounded-xl h-11 transition-colors ${
            isFieldInvalid(fieldName)
                ? "border-red-500 focus:border-red-500/50 focus:ring-red-500/20"
                : "border-gray-700/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
        }`;

    const sections = [
        {
            id: 0,
            title: "Personal Information",
            fields: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-gray-300 text-sm font-medium">
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                required
                                className={InputFieldClassName("name")}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-gray-300 text-sm font-medium">
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                required
                                className={InputFieldClassName("email")}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="text-gray-300 text-sm font-medium">
                                Phone Number *
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                required
                                className={InputFieldClassName("phone")}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="location"
                                className="text-gray-300 text-sm font-medium">
                                Current Location *
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) =>
                                    handleChange("location", e.target.value)
                                }
                                required
                                className={InputFieldClassName("location")}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 1,
            title: "Technical Profile",
            fields: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="role"
                                className="text-gray-300 text-sm font-medium">
                                Role*
                            </Label>
                            <Select
                                value={formData.role}
                                onValueChange={(val) =>
                                    handleChange("role", val)
                                }>
                                <SelectTrigger
                                    className={`${
                                        isFieldInvalid("role")
                                            ? "border-red-500 focus:border-red-500/50 focus:ring-red-500/20"
                                            : "border-gray-700/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                                    } bg-[#0a0f1c]/60 text-white rounded-xl h-11`}>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a2332] border-gray-700/40 rounded-xl">
                                    {ROLE_OPTIONS.map((role) => (
                                        <SelectItem
                                            key={role.value}
                                            value={role.value}
                                            className="text-white hover:bg-[#0a0f1c]/60 focus:bg-[#0a0f1c]/60 rounded-lg">
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="experience"
                                className="text-gray-300 text-sm font-medium">
                                Experience*
                            </Label>
                            <Select
                                value={formData.experience}
                                onValueChange={(val) =>
                                    handleChange("experience", val)
                                }>
                                <SelectTrigger
                                    className={`${
                                        isFieldInvalid("experience")
                                            ? "border-red-500 focus:border-red-500/50 focus:ring-red-500/20"
                                            : "border-gray-700/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                                    } bg-[#0a0f1c]/60 text-white rounded-xl h-11`}>
                                    <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a2332] border-gray-700/40 rounded-xl">
                                    {EXPERIENCE_LEVELS.map((exp) => (
                                        <SelectItem
                                            key={exp.value}
                                            value={exp.value}
                                            className="text-white hover:bg-[#0a0f1c]/60 focus:bg-[#0a0f1c]/60 rounded-lg">
                                            {exp.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="primarySkills"
                            className="text-gray-300 text-sm font-medium">
                            Primary Tech Stack *
                        </Label>
                        <Input
                            id="primarySkills"
                            value={formData.primarySkills}
                            onChange={(e) =>
                                handleChange("primarySkills", e.target.value)
                            }
                            required
                            className={InputFieldClassName("primarySkills")}
                            placeholder="React, Node.js, TypeScript, PostgreSQL"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="secondarySkills"
                            className="text-gray-300 text-sm font-medium">
                            Secondary Skills
                        </Label>
                        <Input
                            id="secondarySkills"
                            value={formData.secondarySkills}
                            onChange={(e) =>
                                handleChange("secondarySkills", e.target.value)
                            }
                            className="bg-[#0a0f1c]/60 border-gray-700/40 text-white placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 rounded-xl h-11"
                            placeholder="Docker, AWS, GraphQL, Redis"
                        />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="github"
                                className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                <FaGithub className="text-cyan-400" />
                                GitHub
                            </Label>
                            <Input
                                id="github"
                                value={formData.github}
                                onChange={(e) =>
                                    handleChange("github", e.target.value)
                                }
                                className="bg-[#0a0f1c]/60 border-gray-700/40 text-white placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 rounded-xl h-11"
                                placeholder="github.com/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="linkedin"
                                className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                <FaLinkedin className="text-cyan-400" />
                                LinkedIn
                            </Label>
                            <Input
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={(e) =>
                                    handleChange("linkedin", e.target.value)
                                }
                                className="bg-[#0a0f1c]/60 border-gray-700/40 text-white placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 rounded-xl h-11"
                                placeholder="linkedin.com/in/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="portfolio"
                                className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                <FaGlobe className="text-cyan-400" />
                                Portfolio
                            </Label>
                            <Input
                                id="portfolio"
                                value={formData.portfolio}
                                onChange={(e) =>
                                    handleChange("portfolio", e.target.value)
                                }
                                className="bg-[#0a0f1c]/60 border-gray-700/40 text-white placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 rounded-xl h-11"
                                placeholder="yourwebsite.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="resume"
                            className="text-gray-300 text-sm font-medium flex items-center gap-2">
                            <FaFileCode className="text-cyan-400" />
                            Resume/CV Link *
                        </Label>
                        <Input
                            id="resume"
                            value={formData.resume}
                            onChange={(e) =>
                                handleChange("resume", e.target.value)
                            }
                            required
                            className={InputFieldClassName("resume")}
                            placeholder="https://drive.google.com/resume.pdf"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Please provide a publicly accessible link (Google
                            Drive, Dropbox, etc.)
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 2,
            title: "Additional Information",
            fields: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="canJoin"
                            className="text-gray-300 text-sm font-medium">
                            When can you start? *
                        </Label>
                        <Input
                            id="canJoin"
                            value={formData.canJoin}
                            onChange={(e) =>
                                handleChange("canJoin", e.target.value)
                            }
                            required
                            className={InputFieldClassName("canJoin")}
                            placeholder="e.g., Immediately, After 1 month"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="coverLetter"
                            className="text-gray-300 text-sm font-medium">
                            Why do you want to join us? *
                        </Label>
                        <Textarea
                            id="coverLetter"
                            value={formData.coverLetter}
                            onChange={(e) =>
                                handleChange("coverLetter", e.target.value)
                            }
                            required
                            className={InputFieldClassName("coverLetter")}
                            placeholder="Tell us about your motivation, what excites you about this role, and what you can bring to our team..."
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full max-w-4xl lg:max-w-6xl mx-auto">
            <div className="bg-[#1a2332]/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header with progress */}
                <div className="relative border-b border-gray-700/30 p-8 bg-gradient-to-br from-[#1a2332]/80 to-[#0a0f1c]/80">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                    <div className="mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Join Our Awesome Team
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Step {currentSection + 1} of {sections.length}
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-[#0a0f1c]/60 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${
                                    ((currentSection + 1) / sections.length) *
                                    100
                                }%`,
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Section indicators */}
                    <div className="flex justify-between mt-4">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                                        index <= currentSection
                                            ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                                            : "bg-[#0a0f1c]/60 text-gray-500"
                                    }`}>
                                    {index + 1}
                                </div>
                                <div
                                    className={`text-xs text-center transition-colors duration-300 ${
                                        index <= currentSection
                                            ? "text-cyan-400"
                                            : "text-gray-600"
                                    }`}>
                                    {section.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form content */}
                <form onSubmit={handleSubmit} className="py-8 px-4 sm:px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}>
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                                {sections[currentSection].title}
                            </h3>
                            {sections[currentSection].fields}
                        </motion.div>
                    </AnimatePresence>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-red-400 text-sm font-medium">
                                {error}
                            </p>
                        </motion.div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex gap-4 mt-8">
                        {currentSection > 0 && (
                            <Button
                                type="button"
                                onClick={() =>
                                    setCurrentSection(currentSection - 1)
                                }
                                className="flex-1 bg-[#0a0f1c]/60 hover:bg-[#0a0f1c] border border-gray-700/40 text-white rounded-xl h-12 transition-all">
                                Previous
                            </Button>
                        )}
                        {currentSection < sections.length - 1 ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    if (validateSection(currentSection))
                                        setCurrentSection(currentSection + 1);
                                    else {
                                        toast.error(
                                            "Please fill in all required fields."
                                        );
                                        setTouchedSections((prev) =>
                                            new Set(prev).add(currentSection)
                                        );
                                    }
                                }}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl h-12 transition-all shadow-lg shadow-cyan-500/20">
                                Next Step
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl h-12 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20">
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </div>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
