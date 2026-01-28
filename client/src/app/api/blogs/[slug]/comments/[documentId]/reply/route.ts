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

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("Reply comment error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized. Only authors can reply." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to post reply" },
            { status: 500 }
        );
    }
}