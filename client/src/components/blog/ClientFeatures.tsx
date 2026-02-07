"use client";

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
import { useAppSelector } from '@/redux/hooks';
import MetaFetcher from "./MetaFetcher";

interface AuthFeatureProps {
    blog: Blog;
}

const ClientFeatures = ({ blog }: AuthFeatureProps) => {
    const { user } = useAppSelector(state => state.auth);


    return (
        <>
            <MetaFetcher blog={blog} />
            <div className="space-y-6">
                {/* Author Card */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <UserCard user={blog.user} />
                        <div className="flex items-center gap-2">
                            {user && <ReactBar blogId={blog.documentId} user={user} />}
                            <BlogMeta documentId={blog.documentId} />
                        </div>
                    </CardContent>
                </Card>

                {/* Comment Section */}
                {!user ? (
                    <Card className="shadow-sm">
                        <CardContent className="p-6 text-center space-y-4">
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
                <CommentList user={user} documentId={blog.documentId} />
            </div>
        </>
    );
};

export default ClientFeatures;