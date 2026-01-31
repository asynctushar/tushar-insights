import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie, } from "@/services/auth.service";

export async function GET(req: NextRequest) {
    try {
        await removeAuthCookie();

        return NextResponse.json({
            success: true,
            message: "Logged out"
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}
