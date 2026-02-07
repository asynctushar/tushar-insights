import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllBlogs, getBlog, getBlogs } from "@/services/blog.service";
import { Blog as IBlog } from "@/types/blog.type";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import BlogCard from "@/components/blog/BlogCard";
import { linkGenerator } from "@/lib/blog";

import type { Metadata } from "next";
import { getLangFromLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import ClientFeatures from "@/components/blog/ClientFeatures";
import { AlertCircle } from "lucide-react";

type BlogProps = {
    params: Promise<{
        slug: string;
        locale?: string[];
    }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
    const locales = ["en", "bn"];
    const params: { slug: string; locale?: string[]; }[] = [];

    // 1️⃣ Fetch all blogs separately for EN and BN if needed
    const blogsResultEn = await getAllBlogs({}, "en");
    const blogsResultBn = await getAllBlogs({}, "bn");

    if (!blogsResultEn.ok || !blogsResultEn.data?.blogs) return [];
    if (!blogsResultBn.ok || !blogsResultBn.data?.blogs) return [];

    // Combine all slugs from both languages to ensure every blog is included
    const slugSet = new Set<string>();
    blogsResultEn.data.blogs.forEach((b: IBlog) => slugSet.add(b.slug));
    blogsResultBn.data.blogs.forEach((b: IBlog) => slugSet.add(b.slug));

    // 2️⃣ Generate all combinations of slug + locale
    for (const slug of Array.from(slugSet)) {
        for (const l of locales) {
            params.push({
                slug,
                locale: l === "en" ? [] : [l], // optional catch-all
            });
        }
    }

    return params;
}



export async function generateMetadata(
    { params }: BlogProps
): Promise<Metadata> {
    const { locale, slug } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return {
            title: "Blog Not Found",
            description:
                "The blog you are looking for does not exist or may have been removed.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const blogResult = await getBlog(slug, lang);
    const blog = blogResult.data;

    if (!blog) {
        return {
            title: "Blog Not Found",
            description:
                "The blog you are looking for does not exist or may have been removed.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }


    return {
        title: blog.title,
        description:
            blog.excerpt ||
            `Read this article on ${blog.category?.name} at Tushar Insights.`,

        keywords: [
            blog.title,
            blog.category?.name,
            "Tushar Insights",
            "Web Development Blog",
            "React",
            "Next.js",
        ],

        robots: {
            index: true,
            follow: true,
        },
    };
}


const Blog = async ({ params }: BlogProps) => {
    const { locale, slug } = await params;
    const lang = getLangFromLocale(locale);

    if (!lang) {
        return notFound();
    }


    // 2️⃣ Blog is BLOCKING
    const blogResult = await getBlog(slug, lang);

    if (!blogResult.ok) {
        // if your service returns status
        if (blogResult.error?.status === 404) {
            return (
                <div className="container mx-auto px-4 min-h-[calc(100vh-64px)] flex items-center justify-center">
                    <Card className="max-w-md w-full shadow-lg mb-24">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">
                                    No Blog Found
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {blogResult.error?.message || "Something went wrong while loading blog."}
                                </p>
                            </div>
                            <Button asChild className="mt-4">
                                <Link href={linkGenerator("/blogs", lang)}>
                                    Browse All Blogs
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="container mx-auto px-4 min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Card className="max-w-md w-full shadow-lg mb-24">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Failed to Load Blog
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {blogResult.error?.message || "Something went wrong while loading featured blogs."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const blog: IBlog = blogResult.data;
    const categoryUrl = `/blogs${blog.locale === "bn" ? "/bn" : ""}?category=${blog.category.documentId}`;

    // 3️⃣ Similar blogs are NON-BLOCKING
    const similarResult = await getBlogs(
        {
            documentId: blog.category.documentId,
            sort: "createdAt:desc",
            page: 1,
            pageSize: 6,
        },
        lang
    );

    const similarBlogs: IBlog[] =
        similarResult.ok ? similarResult.data?.blogs : [];

    const coverSrc = blog.cover.formats?.medium.url?.startsWith("http")
        ? blog.cover.formats.medium.url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.cover.formats?.medium.url}`;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <Card className="lg:col-span-2 py-4 sm:py-6">
                    {/* Blog Article */}
                    <CardContent className="space-y-8 px-4 sm:px-6">
                        <article className="space-y-6">
                            {/* Cover Image */}
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src={`${coverSrc}`}
                                    alt={blog.cover.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
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
                                                    <Image
                                                        width={400}
                                                        height={300}
                                                        src={imageSrc}
                                                        alt={alt}

                                                        className="rounded-lg w-2/3 h-auto shadow-md"
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

                        <ClientFeatures blog={blog} />
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