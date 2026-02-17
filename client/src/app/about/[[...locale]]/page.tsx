import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { getAbout } from '@/services/company.service';
import { About as IAbout } from '@/types/company.type';
import Image from 'next/image';
import { AlertCircle, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from "next";
import { getLangFromLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn more about Tushar Biswas, a full-stack and frontend developer building modern, performant web applications using React and Next.js.",

    keywords: [
        "About Tushar Biswas",
        "Frontend Developer",
        "Full Stack Developer",
        "React Developer",
        "Next.js Developer",
        "Web Developer Portfolio",
    ],

    robots: {
        index: true,
        follow: true,
    },
};


const socials = [
    { href: "https://facebook.com", label: "Facebook", icon: Facebook },
    { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
    { href: "https://twitter.com", label: "Twitter", icon: Twitter },
    { href: "https://instagram.com", label: "Instagram", icon: Instagram },
];

interface AboutProps {
    params: Promise<{
        locale?: string[];
    }>;
};

export async function generateStaticParams() {
    const locales = ["en", "bn"];
    return locales.map((locale) => ({
        locale: locale === "en" ? [] : [locale], // [] for default language
    }));
}

const About = async ({ params }: AboutProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }

    const result = await getAbout();

    if (!result.ok) {
        return (
            <div className="container mx-auto px-4 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Card className="max-w-md w-full shadow-lg mb-24">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Failed to Load About Page
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {result.error?.message || "Something went wrong while loading about."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2️⃣ Safe to use data
    const about: IAbout = result.data;


    const profilePic = about.profilePic?.url.startsWith("http")
        ? about.profilePic?.url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${about.profilePic?.url}`;


    return (
        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

            {/* Hero Section */}
            <div className="relative space-y-3 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
                    <span className="inline-block w-6 h-px bg-primary" />
                    About
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                    About
                </h1>
                <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                    Learn more about Tushar Biswas and the journey behind Tushar Insights.
                </p>
            </div>

            {/* Profile + Content Combined */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Sticky Profile Sidebar */}
                <div className="lg:col-span-1 lg:sticky lg:top-24">
                    <div className="rounded-xl border border-border bg-muted/30 p-6 flex flex-col items-center text-center space-y-5">

                        {/* Profile Picture */}
                        {profilePic && (
                            <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                                <Image
                                    src={profilePic}
                                    fill
                                    alt={about.name}
                                    className="rounded-full object-cover ring-4 ring-primary/15 shadow-md"
                                    priority
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-foreground">{about.name}</h2>
                        </div>

                        {/* Roles */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {about.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-border" />

                        {/* Social Links */}
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            {socials.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group w-9 h-9 rounded-full border border-border bg-background hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200"
                                        aria-label={item.label}
                                    >
                                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="lg:col-span-2 space-y-6">

                    {[
                        { emoji: "📖", title: "Biography", content: about.biography },
                        { emoji: "🌿", title: "Beyond Code", content: about.beyondCode },
                        { emoji: "💡", title: "The Idea Behind Tushar Insights", content: about.idea },
                        { emoji: "🎯", title: "Goals and Vision", content: about.goals },
                    ].map(({ emoji, title, content }) => (
                        <div key={title} className="rounded-xl border border-border overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-border bg-muted/40 flex items-center gap-2.5">
                                <span className="text-base">{emoji}</span>
                                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                            </div>
                            <div className="px-6 py-5 bg-background">
                                <div className="rich-text about-card prose prose-slate dark:prose-invert max-w-none text-sm text-muted-foreground">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Thanking Message */}
                    {about.thankingMessage && (
                        <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
                            <div className="rich-text about-card prose prose-slate dark:prose-invert max-w-none text-sm text-muted-foreground">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {about.thankingMessage}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {/* Footer Note */}
                    {about.footer && (
                        <div className="rounded-xl border border-border bg-muted/30 px-6 py-5">
                            <div className="rich-text about-card prose prose-slate dark:prose-invert max-w-none text-sm text-muted-foreground">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {about.footer}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default About;;;