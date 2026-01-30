import { updateReaction, deleteReaction } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { validateReactionType } from "@/lib/validations";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { slug: string; documentId: string; }; }
) {
    try {
        const { slug, documentId } = await params;
        const jwt = await getJwtFromCookies();
        const body = await request.json();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!body.type) {
            return NextResponse.json(
                { error: "Reaction type is required" },
                { status: 400 }
            );
        }

        if (!validateReactionType(body.type)) {
            return NextResponse.json(
                { error: "Invalid reaction type" },
                { status: 400 }
            );
        }

        const result = await updateReaction(jwt, slug, documentId, { type: body.type });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("Update reaction error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to update reaction" },
            { status: 500 }
        );
    }
}

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

        await deleteReaction(jwt, slug, documentId);

        return NextResponse.json(
            { success: true, message: "Reaction removed successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete reaction error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to delete reaction" },
            { status: 500 }
        );
    }
}