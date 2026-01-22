// lib/strapi/client.ts

type StrapiClientOptions = {
    lang?: string;
    cache?: RequestCache;
    token?: string;
};

type StrapiClientResponse<T> = {
    ok: boolean;
    status: number;
    data: T | null;
};

export const strapiClient = async <T = any>(
    url: string,
    options?: StrapiClientOptions
): Promise<StrapiClientResponse<T>> => {

    const fullUrl = new URL(
        url,
        process.env.STRAPI_URL // ensures proper joining
    );

    // Locale handling (i18n)
    if (options?.lang) {
        fullUrl.searchParams.set('locale', options.lang);
    }



    const res = await fetch(fullUrl.toString(), {
        headers: {
            'Content-Type': 'application/json',
            ...(options?.token && {
                Authorization: `Bearer ${options.token}`,
            }),
        },
        cache: options?.cache ?? 'force-cache',
    });


    // Expected non-OK responses (404, 401, etc.)
    if (!res.ok) {
        return {
            ok: false,
            status: res.status,
            data: null,
        };
    }

    const json = await res.json();

    return {
        ok: true,
        status: res.status,
        data: json?.data ?? null, // normalize Strapi response
    };
};
