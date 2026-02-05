import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { linkGenerator } from "@/lib/blog";
import { searchBlogs } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";
import Link from "next/link";
import type { Metadata } from "next";
import { getLangFromLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

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

const Search = async ({ searchParams, params }: SearchProps) => {
    const { locale } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }

    const { q: query } = await searchParams;
    if (!query) {
        return <h4>
            Please Input search query

            <Button asChild><Link href="/">Browse all Blogs</Link></Button>
        </h4>;
    }

    const result = await searchBlogs(query, lang);
    if (!result.ok) {
        return (
            <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 py-8">
                <p className="text-red-500">
                    Failed to load search page: {result.error?.message}
                </p>
            </div>
        );
    }

    const blogs: Blog[] = result.data;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {`Search results for ${query}`}
            </h1>

            {blogs.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="container mx-auto px-4 py-48 text-center space-y-4">
                    <h2 className="text-2xl font-semibold">No blogs found.</h2>
                    <Button asChild>
                        <Link href={linkGenerator("/blogs", lang)}>Browse all Blogs</Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Search;
