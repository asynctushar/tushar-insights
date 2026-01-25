import BlogCard from "@/components/blog/BlogCard";
import { getFeaturedBlogs } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";

type HomeProps = {
    searchParams: {
        lang?: string;
    };
};

const Home = async ({ searchParams }: HomeProps) => {
    const { lang } = await searchParams;

    const blogs: Blog[] = await getFeaturedBlogs(lang);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">
                Featured Blogs
            </h1>

            {blogs.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No Featured blogs found.</p>
                </div>
            )}
        </div>
    );
};

export default Home;