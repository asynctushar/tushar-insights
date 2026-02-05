import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { linkGenerator } from "@/lib/blog";
import { getLangFromLocale } from "@/lib/i18n";
import { getFeaturedBlogs } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";
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
        locale: locale === "en" ? [] : [locale], // [] for default language
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
            <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 py-8">
                <p className="text-red-500">
                    Failed to load featured blog page: {result.error?.message}
                </p>
            </div>
        );
    }

    const blogs: Blog[] = result.data;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {lang === "bn" ? "বৈশিষ্ট্যযুক্ত ব্লগ" : "Featured Blogs"}
            </h1>

            {blogs.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="container mx-auto px-4 py-48 text-center space-y-4">
                    <h2 className="text-2xl font-semibold">No Featured blogs found.</h2>
                    <Button asChild>
                        <Link href={linkGenerator("/blogs", lang)}>Browse all Blogs</Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Home;