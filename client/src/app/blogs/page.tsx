import BlogCard from "@/components/blog/BlogCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import Pagination from "@/components/blog/Pagination";
import SortBy from "@/components/blog/SortBy";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogCategories, getBlogs } from "@/services/blog.service";
import { Blog, Category } from "@/types/blog.type";

type BlogsProps = {
    searchParams: {
        lang?: string;
        category?: string;
        sort?: string;
        page?: string;
    };
};

const Blogs = async ({ searchParams }: BlogsProps) => {
    const { lang, category, sort, page } = await searchParams;

    const categories: Category[] = await getBlogCategories(lang);
    const { blogs, pagination } = await getBlogs({
        documentId: category,
        sort,
        page: page ? parseInt(page) : 1
    }, lang);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero Section */}
            <Card className="bg-linear-to-r from-primary to-primary/90 border-none">
                <CardContent className="p-8 sm:p-12 space-y-2 text-left text-primary-foreground">
                    <h1 className="text-3xl sm:text-4xl font-bold">Blogs</h1>
                    <p className="max-w-2xl">
                        Explore insights across technology, poems, novels, and more.
                    </p>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                    <CategoryFilter categories={categories} lang={lang} currentCategory={category} />
                    <hr />
                    <SortBy />
                </CardContent>
            </Card>

            {/* Blog Lists */}
            <div>
                {blogs.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {blogs.map((blog: Blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No blogs found.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} />
        </div>
    );
};

export default Blogs;