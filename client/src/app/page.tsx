import BlogItem from "@/components/blog/BlogItem";
import { getFeaturedBlogs, searchBlogs } from "@/services/blog.service";
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
        <div className="container mx-auto py-6">
            <h3 className="text-xl font-semibold mb-4">
                Featured Blogs
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

export default Home;
