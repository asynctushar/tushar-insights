import BlogItem from "@/components/blog/BlogItem";
import { Button } from "@/components/ui/button";
import { getFeaturedBlogs, searchBlogs } from "@/services/blog.service";
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
        <div className="container mx-auto py-6">
            <h3 className="text-xl font-semibold mb-4">
                {`Search results for ${query}`}
            </h3>

            {blogs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <BlogItem key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <h4>No blogs found.</h4>
            )}
        </div>
    );
};

export default Search;
