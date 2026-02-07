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
        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero Section */}
            <Card className="bg-muted/50 border-muted shadow-sm">
                <CardContent className="p-6 sm:p-12 space-y-2 text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">About</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Learn more about Tushar Biswas and the journey behind Tushar Insights.
                    </p>
                </CardContent>
            </Card>

            {/* Profile Card */}
            <Card className="shadow-sm border-0 bg-secondary dark:bg-muted/50">
                <CardContent className="">
                    <div className="flex flex-col items-center text-center space-y-6">
                        {/* Profile Picture */}
                        {profilePic && (
                            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                                <Image
                                    src={profilePic}
                                    fill
                                    alt={about.name}
                                    className="rounded-full object-cover shadow-sm ring-2 ring-primary/10"
                                    priority
                                />
                            </div>
                        )}

                        {/* Name */}
                        <h2 className="text-2xl lg:text-3xl font-bold">
                            {about.name}
                        </h2>

                        {/* Roles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-base sm:text-lg font-normal text-foreground">
                            {about.roles.map((role, index) => {
                                const total = about.roles.length;
                                const isOddTotal = total % 2 !== 0;
                                const isLastItem = index === total - 1;

                                const shouldSpanFull =
                                    isOddTotal && isLastItem;

                                const showSeparator =
                                    index % 2 === 0 && !(isOddTotal && isLastItem);

                                return (
                                    <div
                                        key={index}
                                        className={[
                                            'flex items-center justify-center',
                                            showSeparator ? 'sm:justify-end' : 'sm:justify-center',
                                            shouldSpanFull ? 'sm:col-span-2' : '',
                                        ].join(' ')}
                                    >
                                        <span className="px-2">{role}</span>

                                        {/* Separator — desktop only */}
                                        {showSeparator && (
                                            <span className="hidden sm:inline text-foreground font-semibold">
                                                |
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-4">
                            {socials.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300 hover:scale-110 shadow-md"
                                        aria-label={item.label}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-orange-50 dark:bg-muted/50  py-6 md:py-8 lg:py-12">
                <CardContent className='px-6 md:px-8 lg:px-12 space-y-8'>
                    <div className='rich-text about-card'>
                        <h2 className='text-2xl md:3xl mb-6'>
                            📖 Biography
                        </h2>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {about.biography}
                        </ReactMarkdown>
                        <hr />
                    </div>
                    <div className='rich-text about-card'>
                        <h2 className='text-2xl md:3xl mb-6'>
                            🌿 Beyond Code
                        </h2>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {about.beyondCode}
                        </ReactMarkdown>
                        <hr />
                    </div>
                    <div className='rich-text about-card'>
                        <h2 className='text-2xl md:3xl mb-6'>
                            💡 The Idea Behind Tushar Insights
                        </h2>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {about.idea}
                        </ReactMarkdown>
                        <hr />
                    </div>
                    <div className='rich-text about-card'>
                        <h2 className='text-2xl md:3xl mb-6'>
                            🎯 Goals and Vision
                        </h2>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {about.goals}
                        </ReactMarkdown>
                        <hr />
                    </div>
                    <div className='rich-text about-card'>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {about.thankingMessage}
                        </ReactMarkdown>
                        <hr />
                    </div>
                    <div className='rich-text about-card'>
                        <h2 className='text-2xl md:3xl mb-6'>
                            📖 Biography
                        </h2>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {about.footer}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default About;;;