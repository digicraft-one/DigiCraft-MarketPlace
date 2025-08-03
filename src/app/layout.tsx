import { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Digicraft Marketplace",
    description: "Resell and rebrand stunning websites.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#0f0f0f] text-primary`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
