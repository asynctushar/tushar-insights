import { NextRequest, NextResponse } from "next/server";
import { setRedirectCookie } from "@/services/auth.service";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL!;

export async function GET(req: NextRequest) {
    const redirectUrl =
        req.nextUrl.searchParams.get("redirect") || "/";

    await setRedirectCookie(redirectUrl);

    return NextResponse.redirect(
        `${STRAPI_URL}/api/connect/google`
    );
}
