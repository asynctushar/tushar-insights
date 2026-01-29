import { strapiClient } from "@/lib/strapi";
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

export async function removeAuthCookie() {
    const cookieStore = await cookies();

    cookieStore.delete("jwt");
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

    const res = await fetch(`${STRAPI_URL}/api/users/me?populate[role]=true&populate[profilePic]=true`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
}


// Ban/Unban user (author only) - toggles automatically in backend
export const banUser = async (jwt: string, userId: string) => {
    const res = await strapiClient(`/api/users/${userId}`, {
        method: 'PUT',
        jwt,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(res.error?.message || 'Failed to update user status');
    }

    return res.data;
};

// Delete user (author only)
export const deleteUser = async (jwt: string, userId: string) => {
    const res = await strapiClient(`/api/users/${userId}`, {
        method: 'DELETE',
        jwt,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(res.error?.message || 'Failed to delete user');
    }

    return res.data;
};