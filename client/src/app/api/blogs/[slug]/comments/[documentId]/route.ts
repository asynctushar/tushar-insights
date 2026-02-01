import { deleteComment } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTags } from "@/lib/cache";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; documentId: string; }>; }
) {
    try {
        const { slug, documentId } = await params;
        const jwt = await getJwtFromCookies();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await deleteComment(jwt, slug, documentId);
        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to delete Comment" },
                { status: result.error?.status || 400 }
            );
        }

        revalidateTags(["blogs", "featured:blogs", "search:blogs", `blog:${slug}`]);
        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
}