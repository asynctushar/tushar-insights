import { Card, CardContent, } from '@/components/ui/card';
import { getTerms } from '@/services/company.service';
import { Term } from '@/types/company.type';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import type { Metadata } from "next";
import { getLangFromLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Read the terms and conditions governing the use of Tushar Insights and its content.",

    robots: {
        index: true,
        follow: true,
    },
};


interface TermsProps {
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


const TermsAndConditions = async ({ params }: TermsProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }

    const result = await getTerms();
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
                                Failed to Load Terms
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {result.error?.message || "Something went wrong while loading terms."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const terms: Term[] = result.data;

    return (
        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

            {/* Hero Section */}
            <div className="relative space-y-3 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
                    <span className="inline-block w-6 h-px bg-primary" />
                    Legal
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                    Terms & Conditions
                </h1>
                <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                    Understand the rules and guidelines for using Tushar Insights.
                </p>
            </div>

            {/* Terms */}
            <div className="bg-muted/30 rounded-xl border border-border divide-y divide-border">
                {
                    terms.map((term) => (
                        <div key={term.documentId} className="px-6 sm:px-8 py-6 space-y-3">
                            <h4 className="text-base font-semibold text-foreground flex items-start gap-3">
                                <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                    {term.sort}
                                </span>
                                {term.title}
                            </h4>
                            <div className="rich-text prose prose-slate dark:prose-invert max-w-none pl-9 text-sm text-muted-foreground term-desc">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {term.desc}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default TermsAndConditions;