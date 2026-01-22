import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getBlog } from "@/services/blog.service";
import { Blog as IBlog } from "@/types/blog.type";
import Image from "next/image";
import Link from "next/link";
import CommentItem from "./CommentItem";
import UserCard from "@/components/user/UserCard";
import { getMe } from "@/services/auth.service";

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
    const user = await getMe();

    const blog: IBlog = await getBlog(slug, lang);
    console.log(user);

    if (!blog) {
        return <div>
            <h2>Blog not found</h2>
            <Button asChild>
                <Link href="/blogs">Browse all Blogs</Link>
            </Button>
        </div>;
    }

    return (
        <div>
            <div>
                <Image src={`${process.env.STRAPI_URL}${blog.cover.url}`} alt={blog.cover.name} width={blog.cover.width} height={blog.cover.width} />
                <h2>{blog.title}</h2>
                <div>
                    <Badge asChild>
                        <Link href={`/blogs?category=${blog.category.documentId}&lang=${lang}`}>
                            {blog.category.title}
                        </Link>
                    </Badge>
                    <span>{blog.createdAt.toString()}</span>
                </div>
                <div>
                    {blog.desc}
                </div>
            </div>
            <Card className="flex justify-between items-center">
                <UserCard user={blog.user} />
                <div className="flex gap-1 items-center">
                    {/* React button(if use authenticated, oncliking it opens react menu), {reactions button(show top three react type emoji, clicking opens a menu)}, share button */}
                </div>
            </Card>

            {!user && (
                <Card>
                    <p>
                        👋 Join the conversation! Sign in to react and comment on this post.
                    </p>
                    <Button asChild>
                        <Link
                            href={`/api/auth/google?redirect=/blogs/${slug}${lang ? `?lang=${lang}` : ""}`}
                        >
                            Login with Google
                        </Link>
                    </Button>
                </Card>
            )}

            {/* if authenticated */}
            <Card>
                <h4>Comments</h4>
                <Input placeholder="Share your thought about the blog..." />
                <div className="flex justify-end">
                    <Button>Submit</Button>
                </div>
            </Card>

            {/* Comments */}
            <Card>
                {
                    blog.comments.length > 0 ? blog.comments.map((comment) => <CommentItem comment={comment} key={comment.documentId} />) : (
                        <span>No comments yet.</span>
                    )
                }
            </Card>

        </div>
    );
};

export default Blog;