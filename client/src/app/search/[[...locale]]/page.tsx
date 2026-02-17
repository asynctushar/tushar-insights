import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { createUrl, linkGenerator } from "@/lib/blog";
import { getBlogCategories, searchBlogs } from "@/services/blog.service";
import { Blog, Category } from "@/types/blog.type";
import Link from "next/link";
import type { Metadata } from "next";
import { getLangFromLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Search Blogs",
    description:
        "Search blogs on Tushar Insights to find articles on React, Next.js, frontend performance, and full-stack web development.",

    keywords: [
        "Search Blogs",
        "Web Development Blog Search",
        "React Articles",
        "Next.js Blogs",
        "Tushar Insights Search",
    ],

    robots: {
        index: true,
        follow: true,
    },
};


type SearchProps = {
    searchParams: Promise<{
        q?: string;
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

const Search = async ({ searchParams, params }: SearchProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }

    const { q: query } = await searchParams;
    if (!query) {
        return (
            <div className="container mx-auto px-4 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Card className="max-w-md w-full shadow-lg mb-24">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Please input search query
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                We filter blogs based on search query.
                            </p>
                        </div>
                        <Button asChild className="mt-4">
                            <Link href={linkGenerator("/blogs", lang)}>
                                Browse All Blogs
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const result = await searchBlogs(query, lang);
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
                                Failed to search blogs
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {result.error?.message || "Something went wrong while searching blogs."}
                            </p>
                        </div>
                        <Button asChild className="mt-4">
                            <Link href={linkGenerator("/blogs", lang)}>
                                Browse All Blogs
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const categoryResult = await getBlogCategories(lang);
    if (!categoryResult.ok) {
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

    const categories: Category[] = categoryResult.data;

    const blogs: Blog[] = result.data;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <h1 className="text-2xl font-bold mb-6 col-span-4">
                        {`Search results for ${query}`}
                    </h1>
                    <div className="lg:col-span-3 col-span-4">
                        <div className="flex flex-col gap-6">
                            {blogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    </div>
                    {/* Sidebar — desktop only */}
                    <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">

                        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

                            {/* Header */}
                            <div className="px-4 py-3 border-b border-border">
                                <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Categories</h3>
                            </div>

                            {/* Links */}
                            <div className="p-2 flex flex-col gap-0.5">
                                <Link
                                    href={createUrl(lang)}
                                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/8 transition-colors duration-150"
                                >
                                    {lang === "bn" ? "সব" : "All"}
                                </Link>
                                {categories.map((category) => (
                                    <Link
                                        key={category.documentId}
                                        href={createUrl(lang, category.documentId)}
                                        className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/8 transition-colors duration-150"
                                    >
                                        {category.title}
                                    </Link>
                                ))}
                            </div>

                            {/* Divider + Browse All — inside same card */}
                            <div className="border-t border-border p-2">
                                <Link
                                    href={lang === "bn" ? "/blogs/bn" : "/blogs"}
                                    className="group flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-semibold text-foreground dark:text-foreground/80 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/15 dark:hover:text-foreground transition-colors duration-150"
                                >
                                    <span>{lang === "bn" ? "সব ব্লগ দেখুন" : "Browse All Blogs"}</span>
                                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
                    <Card className="max-w-md w-full shadow-lg mb-24">
                        <CardContent className="p-8 sm:p-12 text-center space-y-4">
                            <div className="text-6xl mb-4">📝</div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold">
                                    No Blogs Found
                                </h2>
                                <p className="text-muted-foreground">
                                    Browse all blogs in the meantime."
                                </p>
                            </div>
                            <Button asChild className="mt-4">
                                <Link href={linkGenerator("/blogs", lang)}>
                                    Browse All Blogs
                                </Link>
                            </Button>
                        </CardContent >
                    </Card >
                </div >
            )}
        </div >
    );
};

export default Search;
