"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setIsMetaLoading, updateBlog } from "@/redux/slices/blog.slice";
import { getBlogComments, getBlogReactions } from "@/services/blog.service";
import { Blog } from "@/types/blog.type";
import { useEffect } from "react";
import { toast } from "sonner";

interface MetaFetcherProps {
    blog: Blog;
}

const MetaFetcher = ({ blog }: MetaFetcherProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                dispatch(setIsMetaLoading(true));
                const reactionRes = await getBlogReactions(blog.slug);
                const commentRes = await getBlogComments(blog.slug);

                if (!reactionRes.ok) {
                    throw new Error(reactionRes.error?.message || "Failed to fetch reactions.");
                }
                if (!commentRes.ok) {
                    throw new Error(reactionRes.error?.message || "Failed to fetch comments.");
                }

                dispatch(updateBlog({
                    reactions: reactionRes.data,
                    documentId: blog.documentId,
                    slug: blog.slug,
                    comments: commentRes.data
                }));

            } catch (error: any) {
                toast.error(error.message || "Failed to fetch blog meta. Please try again.");
            } finally {
                dispatch(setIsMetaLoading(false));
            }
        };


        fetchMeta();
    }, []);

    return null;
};

export default MetaFetcher;