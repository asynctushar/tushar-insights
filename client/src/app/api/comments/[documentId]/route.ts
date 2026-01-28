import { deleteCommentByAuthor } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { documentId: string; }; }
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

        const { message } = await deleteCommentByAuthor(jwt, documentId);

        return NextResponse.json(
            { success: true, message },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete reply (author) error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized. Only authors can delete reply." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
}