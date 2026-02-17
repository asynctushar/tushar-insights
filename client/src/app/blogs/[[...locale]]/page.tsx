import BlogCard from "@/components/blog/BlogCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import Pagination from "@/components/blog/Pagination";
import SortBy from "@/components/blog/SortBy";
import { Card, CardContent } from "@/components/ui/card";
import { getLangFromLocale } from "@/lib/i18n";
import { getBlogCategories, getBlogs } from "@/services/blog.service";
import { Blog, Category, Pagination as IPagination } from "@/types/blog.type";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
    title: "Blogs",
    description:
        "Browse all blogs on Tushar Insights covering React, Next.js, frontend performance, full-stack development, and modern web engineering.",

    keywords: [
        "Web Development Blogs",
        "React Blog",
        "Next.js Blog",
        "Frontend Development Articles",
        "Full Stack Development Blog",
        "JavaScript Articles",
        "TypeScript Blog",
        "Tushar Insights Blogs",
        "Tech Blogs",
    ],
    robots: {
        index: true,
        follow: true,
    },
};

type BlogsProps = {
    searchParams: Promise<{
        category?: string;
        sort?: string;
        page?: string;
    }>;
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

const Blogs = async ({ searchParams, params }: BlogsProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }

    const { category, sort, page } = await searchParams;
    const result = await getBlogCategories(lang);
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
                                Failed to Load Categories
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {result.error?.message || "Something went wrong while loading categories."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const categories: Category[] = result.data;
    const res = await getBlogs({
        documentId: category,
        sort,
        page: page ? parseInt(page) : 1
    }, lang);

    if (!res.ok) {
        return (
            <div className="container mx-auto px-4 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Card className="max-w-md w-full shadow-lg mb-24">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Failed to Load Blogs
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {res.error?.message || "Something went wrong while loading blogs."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }




    const blogs: Blog[] = res.data?.blogs;
    const pagination: IPagination = res.data?.pagination;


    return (
        <div className="container mx-auto min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-12 space-y-10">

            {/* Hero Section */}
            <div className="relative space-y-3 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
                    <span className="inline-block w-6 h-px bg-primary" />
                    Writing
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Blogs</h1>
                <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                    Explore insights across technology, poems, novels, and more.
                </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                {/* Sidebar */}
                <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">

                    {/* Categories */}
                    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border bg-muted/40">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Categories</h3>
                        </div>
                        <div className="p-3">
                            <CategoryFilter categories={categories} lang={lang} currentCategory={category} />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border bg-muted/40">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Sort By</h3>
                        </div>
                        <div className="p-3">
                            <SortBy lang={lang} />
                        </div>
                    </div>

                </div>

                {/* Blog List + Pagination */}
                <div className="lg:col-span-3 space-y-6">
                    {blogs.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-6">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                            <Pagination lang={lang} pagination={pagination} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-24">
                            <div className="text-center space-y-3">
                                <div className="text-5xl">📝</div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    {lang === "bn" ? "কোনো ব্লগ পাওয়া যায়নি" : "No Blogs Found"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {lang === "bn" ? "ব্লগ শীঘ্রই যোগ করা হবে।" : "Blogs will be added soon."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Blogs;