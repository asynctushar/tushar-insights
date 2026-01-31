import { replyComment } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string; documentId: string; }; }
) {
    try {
        const { slug, documentId } = await params;
        const jwt = await getJwtFromCookies();
        const body = await request.json();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized. Please login." },
                { status: 401 }
            );
        }

        if (!body.desc || !body.desc.trim()) {
            return NextResponse.json(
                { error: "Reply description is required" },
                { status: 400 }
            );
        }

        const result = await replyComment(jwt, slug, documentId, {
            desc: body.desc.trim(),
        });

        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to reply" },
                { status: result.error?.status || 400 }
            );
        }

        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to post reply" },
            { status: 500 }
        );
    }
}