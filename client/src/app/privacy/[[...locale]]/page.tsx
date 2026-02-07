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

        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Hero Section */}
            <Card className="bg-muted/50 border-muted shadow-sm">
                <CardContent className="p-6 sm:p-12 space-y-2 text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Privacy Policy</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        See how we collect, use, and protect your personal information.
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-md border-0">
                <CardContent className='space-y-4'>
                    {
                        policies.map((policy) => (
                            <div key={policy.documentId} className='space-y-2'>
                                <h4 className='text-xl font-semibold'>{`${policy.sort}. ${policy.title}`}</h4>
                                <div className="rich-text privacy-desc prose prose-slate dark:prose-invert max-w-none pl-11">
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
                </CardContent>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;