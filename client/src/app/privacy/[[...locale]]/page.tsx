import { Card, CardContent } from '@/components/ui/card';
import { getPolicies } from '@/services/company.service';
import { Policy } from '@/types/company.type';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import type { Metadata } from "next";
import { getLangFromLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Understand how Tushar Insights collects, uses, and protects user data and privacy.",

    robots: {
        index: true,
        follow: true,
    },
};


interface PolicyProps {
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

const PrivacyPolicy = async ({ params }: PolicyProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }


    const result = await getPolicies();
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
                                Failed to Load Policies
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {result.error?.message || "Something went wrong while loading policies."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2️⃣ Safe to use data
    const policies: Policy[] = result.data;

    return (

        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

            {/* Hero Section */}
            <div className="relative space-y-3 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
                    <span className="inline-block w-6 h-px bg-primary" />
                    Legal
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                    Privacy Policy
                </h1>
                <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                    See how we collect, use, and protect your personal information.
                </p>
            </div>

            {/* Policies */}
            <div className="bg-muted/30 rounded-xl border border-border divide-y divide-border">
                {
                    policies.map((policy) => (
                        <div key={policy.documentId} className="px-6 sm:px-8 py-6 space-y-3">
                            <h4 className="text-base font-semibold text-foreground flex items-start gap-3">
                                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                    {policy.sort}
                                </span>
                                {policy.title}
                            </h4>
                            <div className="rich-text privacy-desc prose prose-slate dark:prose-invert max-w-none pl-9 text-sm text-muted-foreground">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {policy.desc}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default PrivacyPolicy;