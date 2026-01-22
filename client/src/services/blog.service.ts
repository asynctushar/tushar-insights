import { strapiClient } from '@/lib/strapi';

export const getFeaturedBlogs = async (lang?: string) => {
    const res = await strapiClient(
        '/api/blogs?filters[featured]=true',
        { lang: lang ?? 'en', cache: "no-store" }
    );

    return res.data;
};


export const searchBlogs = async (query: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs?filters[title][$containsi]=${encodeURIComponent(query)}`,
        { lang: lang ?? "en", cache: "no-store" }
    );

    return res.data;
};

export const getBlogCategories = async (lang?: string) => {
    const res = await strapiClient(
        `/api/categories`,
        { lang: lang ?? "en", cache: "no-store" }
    );

    return res.data;
};

export const getBlogs = async (
    category: {
        documentId?: string;
    },
    lang?: string) => {
    const res = await strapiClient(
        `/api/blogs${category.documentId ? `?filters[category][documentId]=${encodeURIComponent(category.documentId)}` : ''}`,
        { lang: lang ?? "en", cache: "no-store" }
    );

    return res.data;
};

export const getBlog = async (slug: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs/${encodeURIComponent(slug)}`,
        { lang: lang ?? "en", cache: "no-store" }
    );

    if (!res.ok || res.status === 404) {
        return null;
    }

    return res.data;
};