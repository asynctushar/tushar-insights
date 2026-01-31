import { strapiClient } from "@/lib/strapi";

export const getTerms = async (lang?: string) => {
    const res = await strapiClient(
        `/api/terms?sort=sort:asc`,
        { lang: lang ?? "en", cache: "no-store" }
    );

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

export const getPolicies = async (lang?: string) => {
    const res = await strapiClient(
        `/api/policies?sort=sort:asc`,
        { lang: lang ?? "en", cache: "no-store" }
    );

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

export const getAbout = async (lang?: string) => {
    const res = await strapiClient(
        `/api/about?populate=profilePic`,
        { lang: lang ?? "en", cache: "no-store" }
    );

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