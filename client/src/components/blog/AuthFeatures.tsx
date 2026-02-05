import { getMe } from '@/services/auth.service';
import { User } from '@/types/user.type';
import BlogMeta from "@/components/blog/BlogMeta";
import ReactBar from "@/components/blog/ReactBar";
import CommentList from "@/components/comment/CommentList";
import UserCard from "@/components/user/UserCard";
import CommentBar from "@/components/comment/CommentBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog.type';

interface AuthFeatureProps {
    blog: Blog;
}

const AuthFeatures = async ({ blog }: AuthFeatureProps) => {
    // 1️⃣ Auth is NON-BLOCKING
    const meResult = await getMe();
    const user: User | null = meResult.ok ? meResult.data : null;
    
    return (
        <>
            {/* Author Card */}
            <Card className="shadow-sm py-4 sm:py-6">
                <CardContent className="flex items-center justify-between px-4 sm:px-6">
                    <UserCard user={blog.user} />
                    <div className="flex items-center gap-2">
                        {user && <ReactBar blogId={blog.documentId} user={user} />}
                        <BlogMeta blog={blog} />
                    </div>
                </CardContent>
            </Card>
            {/* Comment Section */}
            {!user ? (
                <Card className="shadow-sm py-4 sm:py-6">
                    <CardContent className="text-center space-y-4 px-4 sm:px-6">
                        <p className="text-muted-foreground text-lg">
                            👋 Join the conversation! Sign in to react and comment on this post.
                        </p>
                        <Button size="lg" variant="outline" asChild>
                            <Link
                                href={`/api/auth/google?redirect=/blogs/slug/${blog.slug}${blog.locale === "bn" ? `/${blog.locale}` : ""}`}
                                className="gap-2"
                            >
                                <Image src="/images/google.png" alt="Google" width={20} height={20} />
                                Login with Google
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <CommentBar user={user} blogId={blog.documentId} />
            )}

            {/* Comments List */}
            <CommentList user={user} blog={blog} />
        </>
    );
};

export default AuthFeatures;