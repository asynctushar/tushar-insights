import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { linkGenerator } from "@/lib/blog";
import { getLangFromLocale } from "@/lib/i18n";
import { getFeaturedBlogs } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type HomeProps = {
    params: Promise<{
        locale: string[];
    }>;
};

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

    const blogs: Blog[] = result.data;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {blogs.length > 0 ? (
                <>
                    <h1 className="text-2xl font-bold mb-6">
                        {lang === "bn" ? "বৈশিষ্ট্যযুক্ত ব্লগ" : "Featured Blogs"}
                    </h1>
                    <div className="flex flex-col gap-6">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
                    <Card className="max-w-md w-full shadow-lg mb-24">
                        <CardContent className="p-8 sm:p-12 text-center space-y-4">
                            <div className="text-6xl mb-4">📝</div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold">
                                    {lang === "bn" ? "কোনো ব্লগ পাওয়া যায়নি" : "No Featured Blogs"}
                                </h2>
                                <p className="text-muted-foreground">
                                    {lang === "bn"
                                        ? "বৈশিষ্ট্যযুক্ত ব্লগ শীঘ্রই যোগ করা হবে।"
                                        : "Featured blogs will be added soon. Browse all blogs in the meantime."}
                                </p>
                            </div>
                            <Button asChild className="mt-4">
                                <Link href={linkGenerator("/blogs", lang)}>
                                    {lang === "bn" ? "সব ব্লগ দেখুন" : "Browse All Blogs"}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Home;