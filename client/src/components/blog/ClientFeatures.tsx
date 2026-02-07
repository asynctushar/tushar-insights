"use client";

import BlogMeta from "@/components/blog/BlogMeta";
import ReactBar from "@/components/blog/ReactBar";
import CommentList from "@/components/comment/CommentList";
import UserCard from "@/components/user/UserCard";
import CommentBar from "@/components/comment/CommentBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog.type';
import { useAppSelector } from '@/redux/hooks';
import MetaFetcher from "./MetaFetcher";

interface ClientFeaturesProps {
    blog: Blog;
}

const ClientFeatures = ({ blog }: ClientFeaturesProps) => {
    const { user, isLoading } = useAppSelector(state => state.auth);

    return (
        <>
            <MetaFetcher blog={blog} />
            <div className="space-y-6">
                {/* Author Card */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <UserCard user={blog.user} />
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {user && <ReactBar blogId={blog.documentId} user={user} />}
                            <BlogMeta documentId={blog.documentId} />
                        </div>
                    </CardContent>
                </Card>

                {/* Comment Section - Auth Only */}
                {isLoading ? (
                    <Card className="shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-9 w-20" />
                            </div>

                            <div className="flex items-start gap-3">
                                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-24 w-full rounded-md" />
                                    <div className="flex justify-end">
                                        <Skeleton className="h-9 w-24" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
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
                    </>
                )}

                {/* Comments List - Has its own skeleton */}
                <CommentList user={user} documentId={blog.documentId} />
            </div>
        </>
    );
};

export default ClientFeatures;