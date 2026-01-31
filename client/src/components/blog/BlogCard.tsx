import { Blog } from "@/types/blog.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import UserCard from "@/components/user/UserCard";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import BlogMeta from "./BlogMeta";

interface BlogCardProps {
    blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
    const blogUrl = `/blogs/${blog.slug}${blog.locale === "bn" ? `?lang=${blog.locale}` : ""}`;
    const categoryUrl = `/blogs?category=${blog.category.documentId}&lang=${blog.locale}`;


    return (
        <Card className="shadow-md">
            <CardContent >
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="relative w-full sm:w-1/3 aspect-video shrink-0 rounded-md overflow-hidden">
                        <Image
                            src={`${blog.cover.url}`}
                            alt={blog.cover.alternativeText || blog.slug}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4 p-4">
                        <Link href={blogUrl}>
                            <h2 className="text-3xl font-semibold line-clamp-2">
                                {blog.title}
                            </h2>
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <Badge className="bg-primary/90 rounded-sm" asChild>
                                <Link href={categoryUrl}>{blog.category.title}</Link>
                            </Badge>
                            <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                        </div>

                        {/* Markdown preview */}
                        <div className="rich-text blog-card-desc">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    a: ({ href, children }) => (
                                        <Link href={href ?? "#"} className="text-primary underline underline-offset-2">
                                            {children}
                                        </Link>
                                    )
                                }}
                            >
                                {blog.desc}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <UserCard user={blog.user} />

                    <div className="flex items-center gap-2">
                        <BlogMeta blog={blog} blogUrl={blogUrl} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BlogCard;
