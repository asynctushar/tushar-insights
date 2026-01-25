import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie, } from "@/services/auth.service";

export async function GET(req: NextRequest) {
    await removeAuthCookie();

    return NextResponse.json({
        success: true,
        message: "Logged out"
    });
}
