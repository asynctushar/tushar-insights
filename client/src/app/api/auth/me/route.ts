import { NextRequest, NextResponse } from "next/server";
import { getMe } from "@/services/auth.service";

export async function GET(req: NextRequest) {
    try {
        const result = await getMe();

        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to authenticate" },
                { status: result.error?.status || 400 }
            );
        }

        return NextResponse.json(result, { status: result.status });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to authenticate" },
            { status: 500 }
        );
    }
}
