import { getJwtFromCookies } from "@/services/auth.service";
import { createComment } from "@/services/blog.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string; }; }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const jwt = await getJwtFromCookies();

        if (!jwt) {
            return NextResponse.json(
                { error: "Please login to comment" },
                { status: 401 }
            );
        }

        if (!body.desc || !body.desc.trim()) {
            return NextResponse.json(
                { error: "Comment description is required" },
                { status: 400 }
            );
        }




        const result = await createComment(jwt, slug, {
            type: body.type || "normal",
            desc: body.desc.trim(),
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("Create comment error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized. Please login to comment." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to create comment" },
            { status: 500 }
        );
    }
}