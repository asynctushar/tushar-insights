import { updateReaction, deleteReaction } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { validateReactionType } from "@/lib/validations";
import { revalidateTags } from "@/lib/cache";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; documentId: string; }>; }
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
        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to update reaction" },
                { status: result.error?.status || 400 }
            );
        }

        revalidateTags(["blogs", "featured:blogs", "search:blogs", `blog:${slug}`]);
        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update reaction" },
            { status: 500 }
        );
    }
}

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

        const result = await deleteReaction(jwt, slug, documentId);
        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to remove reaction" },
                { status: result.error?.status || 400 }
            );
        }


        revalidateTags([`blog:${slug}:reactions`, `blog:${slug}:comments`]);
        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete reaction" },
            { status: 500 }
        );
    }
}