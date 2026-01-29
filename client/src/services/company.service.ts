import { strapiClient } from "@/lib/strapi";

export const getTerms = async (lang?: string) => {
    const res = await strapiClient(
        `/api/terms?sort=sort:asc`,
        { lang: lang ?? "en", cache: "no-store" }
    );

    if (!res.ok) {
        return null;
    }

    return res.data;
};

export const getPolicies = async (lang?: string) => {
    const res = await strapiClient(
        `/api/policies?sort=sort:asc`,
        { lang: lang ?? "en", cache: "no-store" }
    );

    if (!res.ok) {
        return null;
    }

    return res.data;
};