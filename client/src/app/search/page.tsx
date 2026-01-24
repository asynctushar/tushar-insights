import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { searchBlogs } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";
import Link from "next/link";

type SearchProps = {
    searchParams: {
        lang?: string;
        q?: string;
    };
};

const Search = async ({ searchParams }: SearchProps) => {
    const { lang, q: query } = await searchParams;

    if (!query) {
        return <h4>
            Please Input search query

            <Button asChild><Link href="/">Browse all Blogs</Link></Button>
        </h4>;
    }


    const blogs: Blog[] = await searchBlogs(query, lang);

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
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No blogs found.</p>
                </div>
            )}
        </div>
    );
};

export default Search;
