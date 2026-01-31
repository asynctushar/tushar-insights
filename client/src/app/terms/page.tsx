import { Card, CardContent, } from '@/components/ui/card';
import { getTerms } from '@/services/company.service';
import { Term } from '@/types/company.type';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

interface TermsProps {
    searchParams: {
        lang?: string;
    };
};

const TermsAndConditions = async ({ searchParams }: TermsProps) => {
    const { lang } = await searchParams;
    const result = await getTerms();

    if (!result.ok) {
        return (
            <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 py-8">
                <p className="text-red-500">
                    Failed to load term page: {result.error?.message}
                </p>
            </div>
        );
    }

    const terms: Term[] = result.data;

    return (
        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Hero Section */}
            <Card className="bg-muted/50 border-muted shadow-sm">
                <CardContent className="p-6 sm:p-12 space-y-2 text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Terms & Conditions</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Understand the rules and guidelines for using Tushar Insights.
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-md border-0">
                <CardContent className='space-y-4'>
                    {
                        terms.map((term) => (
                            <div key={term.documentId} className='space-y-2'>
                                <h4 className='text-xl font-semibold'>{`${term.sort}. ${term.title}`}</h4>

                                <div className="rich-text prose prose-slate dark:prose-invert max-w-none pl-11 term-desc">
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
                </CardContent>
            </Card>
        </div>
    );
};

export default TermsAndConditions;