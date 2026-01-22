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

        const data = await googleAuthCallback(params);
        if (!data?.jwt) {
            return NextResponse.redirect(new URL("/login?error=auth", req.url));
        }

        await setAuthCookie(data.jwt);
        const redirectUrl = await getRedirectCookie();

        return NextResponse.redirect(
            new URL(redirectUrl, req.url)
        );
    } catch (error) {
        console.error("Google callback error:", error);
        return NextResponse.redirect(new URL("/login?error=server", req.url));
    }
}
