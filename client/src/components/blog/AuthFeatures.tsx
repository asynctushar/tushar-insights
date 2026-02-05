"use client";

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
import { useEffect, useState } from 'react';

interface AuthFeatureProps {
    blog: Blog;
}

const AuthFeatures = ({ blog }: AuthFeatureProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(typeof window !== 'undefined');

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/auth/me");

                if (!isMounted) return;

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                setUser(data.data);
            } catch (error) {
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-4 animate-pulse">
                        <div className="h-12 bg-muted rounded" />
                        <div className="h-32 bg-muted rounded" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Author Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                    <UserCard user={blog.user} />
                    <div className="flex items-center gap-2">
                        {user && <ReactBar blogId={blog.documentId} user={user} />}
                        <BlogMeta blog={blog} />
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
                <CommentBar user={user} blogId={blog.documentId} setUser={setUser} />
            )}

            {/* Comments List */}
            <CommentList user={user} blog={blog} />
        </div>
    );
};

export default AuthFeatures;