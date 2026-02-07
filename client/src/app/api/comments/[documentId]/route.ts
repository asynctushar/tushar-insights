import { deleteCommentByAuthor } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTags } from "@/lib/cache";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ documentId: string; }>; }
) {
    try {
        const { documentId } = await params;
        const jwt = await getJwtFromCookies();
        const body = await request.json();

        if (!body.slug) {
            return NextResponse.json(
                { error: "Blog slug is required" },
                { status: 400 }
            );
        }

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await deleteCommentByAuthor(jwt, documentId);
        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to authenticate" },
                { status: result.error?.status || 400 }
            );
        }

        // revalidate caching
        revalidateTags([`blog:${body.slug}:reactions`, `blog:${body.slug}:comments`]);
        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
}