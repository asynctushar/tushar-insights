import { NextRequest, NextResponse } from "next/server";
import { setRedirectCookie } from "@/services/auth.service";
import { revalidatePath, revalidateTag } from "next/cache";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL!;

export async function GET(req: NextRequest) {
    try {
        const redirectUrl =
            req.nextUrl.searchParams.get("redirect") || "/";

        await setRedirectCookie(redirectUrl);
        revalidatePath(redirectUrl);

        return NextResponse.redirect(
            `${STRAPI_URL}/api/connect/google`
        );

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to login" },
            { status: 500 }
        );
    }
}
