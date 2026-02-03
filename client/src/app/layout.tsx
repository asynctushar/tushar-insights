import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/redux/StoreProvider";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://tushar-insights.vercel.app"),

    title: {
        default: "Tushar Insights | Blogs on Web Development & Tech",
        template: "%s | Tushar Insights",
    },

    description:
        "Tushar Insights is a modern tech blog by Tushar Biswas, sharing articles on web development, React, Next.js, performance optimization, and full-stack engineering.",

    keywords: [
        "Tushar Biswas",
        "Tushar Insights",
        "Web Development Blog",
        "Frontend Developer Blog",
        "Full Stack Developer Blog",
        "React Developer",
        "Next.js Developer",
        "JavaScript",
        "TypeScript",
        "MERN Stack",
        "Strapi CMS",
        "Web Performance",
        "SEO Optimization",
        "Modern Web Apps",
    ],

    authors: [{ name: "Tushar Biswas", url: "https://tushar-insights.vercel.app" }],
    creator: "Tushar Biswas",
    publisher: "Tushar Insights",

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png" }],
    },

    manifest: "/site.webmanifest",

    verification: {
        google: "oNOoVTfS8ubiujOn43XQJYVUuehu4q3YkX9Si-u3uQA",
    },
};


export const dynamic = 'force-dynamic';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <StoreProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="relative flex min-h-screen flex-col">
                            <Header />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                        <Toaster richColors position="bottom-left" />
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}