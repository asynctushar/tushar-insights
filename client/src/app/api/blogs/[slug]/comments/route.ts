import { createComment } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTags } from "@/lib/cache";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; }>; }
) {
    try {
        const { slug } = await params;
        const jwt = await getJwtFromCookies();
        const body = await request.json();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized. Please login to comment." },
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

        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to Create Comment" },
                { status: result.error?.status || 400 }
            );
        }

        revalidateTags(["blogs", "featured:blogs", "search:blogs", `blog:${slug}`]);
        return NextResponse.json(result, { status: result.status });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create comment" },
            { status: 500 }
        );
    }
}