import { deleteComment } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string; documentId: string; }; }
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

        await deleteComment(jwt, slug, documentId);

        return NextResponse.json(
            { success: true, message: "Comment deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete comment error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
}