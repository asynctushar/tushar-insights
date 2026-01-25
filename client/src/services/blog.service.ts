import { strapiClient } from '@/lib/strapi';

export const getFeaturedBlogs = async (lang?: string) => {
    const res = await strapiClient(
        '/api/blogs?filters[featured]=true',
        { lang: lang ?? 'en' }
    );

    return res.data;
};


export const searchBlogSuggestions = async (query: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs/search?query=${encodeURIComponent(query)}`,
        { lang: lang ?? "en", }
    );

    return res.data;
};

export const searchBlogs = async (query: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs?filters[title][$containsi]=${encodeURIComponent(query)}`,
        { lang: lang ?? "en" }
    );

    return res.data;
};

export const getBlogCategories = async (lang?: string) => {
    const res = await strapiClient(
        `/api/categories`,
        { lang: lang ?? "en" }
    );

    return res.data;
};

export const getBlogs = async (
    options: {
        documentId?: string;
        sort?: string;
        page?: number;
        pageSize?: number;
    } = {},
    lang?: string
) => {
    const { documentId, sort = "title:asc", page = 1, pageSize = 10 } = options;

    const params = new URLSearchParams();

    if (documentId) {
        params.append("filters[category][documentId]", documentId);
    }

    params.append("pagination[page]", page.toString());
    params.append("pagination[pageSize]", pageSize.toString());
    params.append("sort", sort);

    const res = await strapiClient(
        `/api/blogs?${params.toString()}`,
        { lang: lang ?? "en" }
    );


    return {
        blogs: res.data,
        pagination: res.meta?.pagination || null,
    };
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

export const createComment = async (
    jwt: string,
    slug: string,
    data: {
        type: string;
        desc: string;
    }
) => {

    const res = await strapiClient(`/api/blogs/${slug}/comments`, {
        method: 'POST',
        body: data,
        token: jwt,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(res.error?.message || 'Failed to create comment');
    }

    return res.data;
};