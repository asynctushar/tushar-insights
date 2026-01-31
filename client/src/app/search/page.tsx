import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { linkGenerator } from "@/lib/blog";
import { searchBlogs } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";
import Link from "next/link";

type SearchProps = {
    searchParams: Promise<{
        lang?: string;
        q?: string;
    }>;
};

const Search = async ({ searchParams }: SearchProps) => {
    const { lang, q: query } = await searchParams;

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
