import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL!;

type GoogleCallbackParams = Record<string, string>;

export async function googleAuthCallback(params: GoogleCallbackParams) {
    const query = new URLSearchParams(params).toString();

    const res = await fetch(
        `${STRAPI_URL}/api/auth/google/callback?${query}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Google auth failed");
    }

    return res.json(); // { jwt, user }
}

export async function setAuthCookie(jwt: string) {
    const cookieStore = await cookies();

    cookieStore.set("jwt", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function setRedirectCookie(url: string) {
    const cookieStore = await cookies();

    cookieStore.set("auth_redirect", url, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
    });
}

export async function getRedirectCookie() {
    const cookieStore = await cookies();

    return cookieStore.get("auth_redirect")?.value || "/";
}

export async function getJwtFromCookies() {
    const cookieStore = await cookies();
    return cookieStore.get("jwt")?.value || null;
}


export async function getMe() {
    const jwt = await getJwtFromCookies();
    if (!jwt) return null;

    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
}
