import BlogItem from "@/components/blog/BlogItem";
import { Button } from "@/components/ui/button";
import { getBlogCategories, getBlogs } from "@/services/blog.service";
import { Blog, Category } from "@/types/blog.type";
import Link from "next/link";

type BlogsProps = {
    searchParams: {
        lang?: string;
        category?: string;
    };
};

const Blogs = async ({ searchParams }: BlogsProps) => {
    const { lang, category } = await searchParams;


    const categories: Category[] = await getBlogCategories(lang);
    const blogs: Blog[] = await getBlogs({ documentId: category }, lang);


    return (
        <div className="py-4 max-w-7xl mx-auto flex flex-col gap-4">

            {/* it would be a card of shadcn */}
            <div className="flex flex-col justify-center bg-linear-0 bg-primary">
                <h2>Blogs</h2>
                <p>Explore insights across technology, poems, novels, and more.</p>
            </div>

            {/* it would be a card of shadcn */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    {/* List All categories and All. Clicking each item will filter the blogs, all will fetch all blogs */}
                    <Button asChild>
                        <Link href={`/blogs${lang === "bn" ? `?lang=${lang}` : ""}`}>
                            All
                        </Link>
                    </Button>
                    {categories.map((category) =>
                        <Button key={category.documentId} asChild>
                            <Link href={`/blogs?category=${category.documentId}${lang === "bn" ? `&lang=${lang}` : ""}`}>
                                {category.title}
                            </Link>
                        </Button>
                    )}
                </div>
                <hr />
                <div className="flex justify-end">
                    sort by
                    {/* Here select options, default Title (A to Z) */}
                </div>
            </div>

            {/* blog lists */}
            <div>
                {blogs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <BlogItem key={blog.documentId} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <h4>No blogs found.</h4>
                )}
            </div>

            {/* Paginations here */}
            <div>
                <Button>Prev</Button>
                <Button>1</Button>
                <Button>2</Button>
                <Button>3</Button>
                <Button>4</Button>
                <span>...</span>
                <Button>Next</Button>
            </div>
        </div>
    );
};

export default Blogs;