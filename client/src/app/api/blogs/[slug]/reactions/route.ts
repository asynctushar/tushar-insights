import { createReaction } from "@/services/blog.service";
import { getJwtFromCookies } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { validateReactionType } from "@/lib/validations";

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string; }; }
) {
    try {
        const { slug } = await params;
        const jwt = await getJwtFromCookies();
        const body = await request.json();

        if (!jwt) {
            return NextResponse.json(
                { error: "Unauthorized. Please login." },
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

        const result = await createReaction(jwt, slug, { type: body.type });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("Create reaction error:", error);

        if (error.message?.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized. Please login." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to create reaction" },
            { status: 500 }
        );
    }
}