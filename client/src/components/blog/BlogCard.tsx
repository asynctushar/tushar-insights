import { Blog } from "@/types/blog.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import UserCard from "@/components/user/UserCard";
import { formatDistanceToNow } from "date-fns";
import { marked } from "marked";

interface BlogCardProps {
    blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
    const blogUrl = `/blogs/${blog.slug}${blog.locale === "bn" ? `?lang=${blog.locale}` : ""}`;
    const categoryUrl = `/blogs?category=${blog.category.documentId}&lang=${blog.locale}`;

    const descHtml = marked.parse(blog.desc ?? "", { breaks: true });

    return (
        <Card className="shadow-md">
            <CardContent className="">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="relative w-full sm:w-1/3 aspect-video shrink-0 rounded-md overflow-hidden">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.cover.url}`}
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
                        <div
                            className="rich-text blog-card-desc"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                    <UserCard user={blog.user} />
                </div>
            </CardContent>
        </Card>
    );
};

export default BlogCard;
