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
        <div className="container mx-auto min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
            {/* Hero Section */}
            <Card className="bg-muted/50 border-muted shadow-sm">
                <CardContent className="p-6 sm:p-12 space-y-2 text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Blogs</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Explore insights across technology, poems, novels, and more.
                    </p>
                </CardContent>
            </Card>


            {/* Filters */}
            <Card className="py-6 sm:py-8">
                <CardContent className="space-y-4 px-6 sm:px-12">
                    <CategoryFilter categories={categories} lang={lang} currentCategory={category} />
                    <hr />
                    <SortBy lang={lang} />
                </CardContent>
            </Card>

            {/* Blog Lists */}
            <div>
                {blogs.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center px-4 mt-12">
                        <Card className="max-w-md w-full shadow-lg">
                            <CardContent className="p-8 sm:p-12 text-center space-y-4">
                                <div className="text-6xl mb-4">📝</div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold">
                                        {lang === "bn" ? "কোনো ব্লগ পাওয়া যায়নি" : "No Blogs Found"}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {lang === "bn"
                                            ? "ব্লগ শীঘ্রই যোগ করা হবে।"
                                            : "Blogs will be added soon."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination lang={lang} pagination={pagination} />
        </div>
    );
};

export default Blogs;