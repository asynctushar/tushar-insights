import { strapiClient } from "@/lib/strapi";
import { cookies } from "next/headers";

type GoogleCallbackParams = Record<string, string>;

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export async function googleAuthCallback(params: GoogleCallbackParams) {
    try {
        const query = new URLSearchParams(params).toString();

        const res = await fetch(`${STRAPI_URL}/api/auth/google/callback?${query}`, {
            cache: 'no-store',
        });

        const data = await res.json();
        // Handle non-OK responses
        if (!res.ok) {
            return {
                ok: false,
                error: {
                    message: data?.error || {
                        message: `Request failed with status ${res.status}`,
                        status: res.status,

                    }
                }
            };
        }

        return {
            ok: true,
            status: res.status,
            data
        };

    } catch (error: any) {
        return {
            ok: false,
            error: {
                message: error.message || 'Network error occurred',
                status: 500,
            }
        };
    }
}

export async function getMe() {
    try {
        const jwt = await getJwtFromCookies();
        
        if (!jwt) return {
            ok: false,
            error: {
                message: "Unauthorized",
                status: 401,
            },

        };

        const res = await fetch(`${STRAPI_URL}/api/users/me?populate[role]=true&populate[profilePic]=true`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            cache: 'no-store',
        });

        const data = await res.json();
        // Handle non-OK responses
        if (!res.ok) {
            return {
                ok: false,
                error: {
                    message: data?.error || {
                        message: `Request failed with status ${res.status}`,
                        status: res.status,

                    }
                }
            };
        }

        return {
            ok: true,
            status: res.status,
            data
        };

    } catch (error: any) {
        return {
            ok: false,

            error: {
                message: error.message || 'Network error occurred',
                status: 500,
            }
        };
    }
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


// Ban/Unban user (author only) - toggles automatically in backend
export const banUser = async (jwt: string, userId: string) => {
    const res = await strapiClient(`/api/users/${userId}`, {
        method: 'PUT',
        jwt,
        cache: 'no-store',
    });

    if (!res.ok) {
        return {
            ok: false,
            error: {
                message: res.error.message,
                status: res.status,
            },

        };
    }

    return {
        ok: true,
        status: res.status,
        data: res.data
    };
};

// Delete user (author only)
export const deleteUser = async (jwt: string, userId: string) => {
    const res = await strapiClient(`/api/users/${userId}`, {
        method: 'DELETE',
        jwt,
        cache: 'no-store',
    });

    if (!res.ok) {
        return {
            ok: false,
            error: {
                message: res.error.message,
                status: res.status,
            },

        };
    }

    return {
        ok: true,
        status: res.status,
        data: res.data
    };
};