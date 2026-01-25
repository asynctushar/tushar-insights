import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBlog, getBlogs } from "@/services/blog.service";
import { Blog as IBlog } from "@/types/blog.type";
import { User } from "@/types/user.type";
import Image from "next/image";
import Link from "next/link";
import CommentItem from "@/components/comment/CommentItem";
import UserCard from "@/components/user/UserCard";
import CommentBar from "@/components/comment/CommentBar";
import { getMe } from "@/services/auth.service";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import BlogCard from "@/components/blog/BlogCard";
import { linkGenerator } from "@/lib/blog";

type BlogProps = {
    searchParams: {
        lang?: string;
    };
    params: {
        slug: string;
    };
};

const Blog = async ({ searchParams, params }: BlogProps) => {
    const { lang } = await searchParams;
    const { slug } = await params;
    const user: User = await getMe();
    const blog: IBlog = await getBlog(slug, lang);

    if (!blog) {
        return (
            <div className="container mx-auto px-4 py-12 text-center space-y-4">
                <h2 className="text-2xl font-semibold">Blog not found</h2>
                <Button asChild>
                    <Link href={linkGenerator("/blogs", lang)}>Browse all Blogs</Link>
                </Button>
            </div>
        );
    }

    const categoryUrl = `/blogs?category=${blog.category.documentId}&lang=${blog.locale}`;
    const { blogs: similarBlogs } = await getBlogs({
        documentId: blog.category.documentId,
        sort: "createdAt:desc",
        page: 1,
        pageSize: 6
    }, lang);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <Card className="lg:col-span-2 py-0 pb-6">
                    {/* Blog Article */}
                    <CardContent className="space-y-8">
                        <article className="space-y-6">
                            {/* Cover Image */}
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.cover.url}`}
                                    alt={blog.cover.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                {blog.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-primary/90 rounded-sm hover:bg-primary" asChild>
                                    <Link href={categoryUrl}>{blog.category.title}</Link>
                                </Badge>
                                <span className="text-muted-foreground">
                                    {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="rich-text prose prose-slate dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        a: ({ href, children }) => (
                                            <Link href={href ?? "#"}>
                                                {children}
                                            </Link>
                                        ),
                                        img: ({ src, alt }) => {
                                            if (!src || typeof src !== "string" || !alt) return null;

                                            const imageSrc = src.startsWith("http")
                                                ? src
                                                : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${src}`;

                                            return (
                                                <div className="relative w-full my-6">
                                                    <img
                                                        src={imageSrc}
                                                        alt={alt}
                                                        className="rounded-lg w-full h-auto shadow-md"
                                                    />
                                                </div>
                                            );
                                        }
                                    }}
                                >
                                    {blog.desc}
                                </ReactMarkdown>
                            </div>
                        </article>

                        {/* Author Card */}
                        <Card className="shadow-md">
                            <CardContent className="flex items-center justify-between">
                                <UserCard user={blog.user} />
                                <div className="flex items-center gap-2">
                                    {/* React, Reactions, Share buttons - later */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comment Section */}
                        {!user ? (
                            <Card className="shadow-md border-primary/20">
                                <CardContent className="text-center space-y-4">
                                    <p className="text-muted-foreground text-lg">
                                        👋 Join the conversation! Sign in to react and comment on this post.
                                    </p>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link
                                            href={`/api/auth/google?redirect=/blogs/${slug}${lang ? `?lang=${lang}` : ""}`}
                                            className="gap-2"
                                        >
                                            <Image src="/images/google.png" alt="Google" width={20} height={20} />
                                            Login with Google
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <CommentBar user={user} blog={blog} />
                        )}

                        {/* Comments List */}
                        <Card className="shadow-md">
                            <CardContent className="">
                                <h3 className="text-xl font-semibold mb-4">
                                    Comments ({blog.comments.length})
                                </h3>
                                {blog.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {blog.comments.map((comment) => (
                                            <CommentItem comment={comment} key={comment.documentId} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">
                                            No comments yet. Be the first to share your thoughts!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <aside className="hidden lg:block space-y-6">
                    <div className="sticky top-22">
                        <h3 className="text-xl font-semibold mb-4">Similar Blogs</h3>
                        {similarBlogs.filter((item: IBlog) => item.documentId !== blog.documentId).length > 0 ? (
                            <div className="space-y-4">
                                {similarBlogs
                                    .filter((item: IBlog) => item.documentId !== blog.documentId)
                                    .map((similarBlog: IBlog) => (
                                        <BlogCard key={similarBlog.id} blog={similarBlog} />
                                    ))}
                            </div>
                        ) : (
                            <Card className="shadow-md">
                                <CardContent className="p-6 text-center space-y-3">
                                    <div className="text-4xl">📚</div>
                                    <p className="text-sm text-muted-foreground">
                                        No similar blogs found in this category yet.
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={linkGenerator("/blogs", lang)}>Explore All Blogs</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Blog;