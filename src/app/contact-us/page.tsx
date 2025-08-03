"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import type { PlanType as Plans } from "@/lib/types";
import { fetchAPI } from "@/lib/api";

const PLAN_OPTIONS: Plans[] = ["base", "plus", "pro", "ultimate"];

interface EnquiryFormState {
    name: string;
    email: string;
    phone: string;
    message: string;
    adjustmentType: Plans;
    product: string;
}

export default function EnquiryForm({ productId }: { productId: string }) {
    const router = useRouter();

    const DEFAULT_VALUES: EnquiryFormState = {
        name: "",
        email: "",
        phone: "",
        message: "",
        adjustmentType: "base",
        product: productId,
    };

    const [formData, setFormData] = useState<EnquiryFormState>(DEFAULT_VALUES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = <K extends keyof EnquiryFormState>(
        field: K,
        value: EnquiryFormState[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetchAPI("/enquiries", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            toast.success("Enquiry submitted. We'll contact you soon.");

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

    return (
        <main className="h-full w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 w-full *:space-y-2">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="product">Product</Label>
                    <Input
                        id="product"
                        name="product"
                        value={formData.product}
                        disabled
                    />
                </div>

                <div>
                    <Label htmlFor="adjustmentType">Plan</Label>
                    <Select
                        value={formData.adjustmentType}
                        onValueChange={(val) =>
                            handleChange("adjustmentType", val as Plans)
                        }>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {PLAN_OPTIONS.map((plan) => (
                                <SelectItem key={plan} value={plan}>
                                    {plan.charAt(0).toUpperCase() +
                                        plan.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                            handleChange("message", e.target.value)
                        }
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Enquiry"}
                </Button>
            </form>
        </main>
    );
}
