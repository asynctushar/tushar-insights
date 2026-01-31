import { NextRequest, NextResponse } from "next/server";
import {
    googleAuthCallback,
    setAuthCookie,
    getRedirectCookie,
} from "@/services/auth.service";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const result = await googleAuthCallback(params);

        if (!result.ok) {
            return NextResponse.json(
                { error: result.error?.message || "Failed to authenticate" },
                { status: result.error?.status || 400 }
            );
        }

        await setAuthCookie(result.data.jwt);
        const redirectUrl = await getRedirectCookie();

        return NextResponse.redirect(
            new URL(redirectUrl, req.url)
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Failed to authenticate" },
            { status: 500 }
        );
    }
}
