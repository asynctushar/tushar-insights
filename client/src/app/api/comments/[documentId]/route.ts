import { deleteCommentByAuthor } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ documentId: string; }>; }
) {
    try {
        const { documentId } = await params;
        const jwt = await getJwtFromCookies();

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

        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
}