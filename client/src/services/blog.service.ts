import { strapiClient } from '@/lib/strapi';

export const getFeaturedBlogs = async (lang?: string) => {
    const res = await strapiClient(
        '/api/blogs?filters[featured]=true',
        {
            lang: lang ?? 'en',
            cache: 'force-cache',
            next: {
                tags: [`featured:blogs`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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


export const searchBlogSuggestions = async (query: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs/search?query=${encodeURIComponent(query)}`,
        {
            lang: lang ?? "en",
            cache: 'force-cache',
            next: {
                tags: [`search:${query}`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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

export const searchBlogs = async (query: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs?filters[title][$containsi]=${encodeURIComponent(query)}`,
        {
            lang: lang ?? "en",
            cache: 'force-cache',
            next: {
                tags: [`search:blogs`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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

export const getBlogCategories = async (lang?: string) => {
    const res = await strapiClient(
        `/api/categories`,
        {
            lang: lang ?? "en",
            cache: 'force-cache',
            next: {
                tags: [`categories`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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

export const getAllBlogs = async (
    options: {
        documentId?: string;
    } = {},
    lang?: string
) => {
    const { documentId} = options;

    const params = new URLSearchParams();

    if (documentId) {
        params.append("filters[category][documentId]", documentId);
    }

    const res = await strapiClient(
        `/api/blogs?${params.toString()}`,
        {
            lang: lang ?? "en",
            cache: 'force-cache',
            next: {
                tags: [`blogs`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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
        data: {
            blogs: res.data,
            pagination: res.meta?.pagination || null,
        }
    };
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
        {
            lang: lang ?? "en",
            cache: 'force-cache',
            next: {
                tags: [`blogs`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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
        data: {
            blogs: res.data,
            pagination: res.meta?.pagination || null,
        }
    };
};

export const getBlog = async (slug: string, lang?: string) => {
    const res = await strapiClient(
        `/api/blogs/${encodeURIComponent(slug)}`,
        {
            lang: lang ?? "en",
            cache: 'force-cache',
            next: {
                tags: [`blog:${slug}`],
                revalidate: 60 * 10, // 10 minutes (optional)
            },
        }
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

// Create comment
export const createComment = async (
    jwt: string,
    slug: string,
    data: {
        type: string;
        desc: string;
    },
) => {
    const res = await strapiClient(`/api/blogs/${slug}/comments`, {
        method: 'POST',
        body: data,
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

// Delete comment (normal user)
export const deleteComment = async (
    jwt: string,
    slug: string,
    documentId: string,
) => {
    const res = await strapiClient(`/api/blogs/${slug}/comments/${documentId}`, {
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

// Reply to comment (author only)
export const replyComment = async (
    jwt: string,
    slug: string,
    commentId: string,
    data: { desc: string; }
) => {
    const res = await strapiClient(`/api/blogs/${slug}/comments/${commentId}/reply`, {
        method: 'POST',
        body: data,
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

// Delete reply (author only)
export const deleteCommentByAuthor = async (jwt: string, commentId: string) => {
    const res = await strapiClient(`/api/comments/${commentId}`, {
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

// Create reaction
export const createReaction = async (
    jwt: string,
    slug: string,
    data: { type: string; }
) => {
    const res = await strapiClient(`/api/blogs/${slug}/reactions`, {
        method: 'POST',
        body: data,
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

// Update reaction
export const updateReaction = async (
    jwt: string,
    slug: string,
    documentId: string,
    data: { type: string; }
) => {
    const res = await strapiClient(`/api/blogs/${slug}/reactions/${documentId}`, {
        method: 'PATCH',
        body: data,
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

// Delete reaction
export const deleteReaction = async (
    jwt: string,
    slug: string,
    documentId: string
) => {
    const res = await strapiClient(`/api/blogs/${slug}/reactions/${documentId}`, {
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
        data: res.data,
    };
};