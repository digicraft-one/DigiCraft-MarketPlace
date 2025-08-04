"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, User, Shield, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (res?.error) {
            setError("Invalid credentials. Please check your username and password.");
        } else {
            router.push("/admin");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 w-fit">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        Admin Access
                    </CardTitle>
                    <p className="text-slate-600 text-sm">
                        Sign in to access the admin dashboard
                    </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                                Username
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter your username"
                                    className="pl-10 border-slate-200 focus:border-blue-500 bg-white text-slate-900 placeholder:text-slate-400"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="pl-10 border-slate-200 focus:border-blue-500 bg-white text-slate-900 placeholder:text-slate-400"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-white">Signing In...</span>
                                </div>
                            ) : (
                                <span className="text-white">Sign In</span>
                            )}
                        </Button>
                    </form>
                    
                    <div className="text-center">
                        <p className="text-xs text-slate-500">
                            Secure admin access for DigiCraft marketplace
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
