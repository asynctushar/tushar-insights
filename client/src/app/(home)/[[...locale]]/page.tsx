import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createUrl, linkGenerator } from "@/lib/blog";
import { getLangFromLocale } from "@/lib/i18n";
import { getBlogCategories, getFeaturedBlogs } from "@/services/blog.service";
import { Blog, Category } from "@/types/blog.type";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type HomeProps = {
    params: Promise<{
        locale: string[];
    }>;
};

export async function generateStaticParams() {
    const locales = ["en", "bn"];
    return locales.map((locale) => ({
        locale: locale === "en" ? [] : [locale],
    }));
}

const Home = async ({ params }: HomeProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }

    const result = await getFeaturedBlogs(lang);
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
                                Failed to Load Blogs
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {result.error?.message || "Something went wrong while loading featured blogs."}
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {blogs.length > 0 ? (
                <div className="space-y-10">

                    {/* Section Header */}
                    <div className="flex items-center gap-3 pb-6 border-b border-border">
                        <span className="inline-block w-6 h-px bg-primary" />
                        <span className="text-xs font-medium text-primary uppercase tracking-widest">
                            {lang === "bn" ? "বৈশিষ্ট্যযুক্ত" : "Featured"}
                        </span>
                        <h1 className="text-xl font-bold text-foreground">
                            {lang === "bn" ? "বৈশিষ্ট্যযুক্ত ব্লগ" : "Featured Blogs"}
                        </h1>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                        {/* Blog List */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            {blogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
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
                </div>
            ) : (
                <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
                    <div className="text-center space-y-4 max-w-md">
                        <div className="text-5xl">📝</div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {lang === "bn" ? "কোনো ব্লগ পাওয়া যায়নি" : "No Featured Blogs"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {lang === "bn"
                                ? "বৈশিষ্ট্যযুক্ত ব্লগ শীঘ্রই যোগ করা হবে।"
                                : "Featured blogs will be added soon. Browse all blogs in the meantime."}
                        </p>
                        <Button asChild className="mt-2">
                            <Link href={linkGenerator("/blogs", lang)}>
                                {lang === "bn" ? "সব ব্লগ দেখুন" : "Browse All Blogs"}
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;