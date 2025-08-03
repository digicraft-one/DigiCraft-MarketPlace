"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (res?.error) setError("Invalid credentials");
        else router.push("/admin");
    }

    return (
        <main className="flex items-center justify-center min-h-screen h-screen w-screen">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                <h1 className="text-2xl font-bold">Admin Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="space-y-2">
                    <Label htmlFor="username">Email</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit">Sign In</Button>
            </form>
        </main>
    );
}
