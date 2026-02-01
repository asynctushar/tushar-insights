type StrapiClientOptions = {
    lang?: string;
    cache?: RequestCache;
    jwt?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
    next?: {
        tags?: string[];
        revalidate?: number;
    };
};


type StrapiClientResponse<T> = {
    ok: boolean;
    status: number;
    data: T | null;
    meta: T | null;
    error?: any;
};

export const strapiClient = async <T = any>(
    url: string,
    options?: StrapiClientOptions
): Promise<StrapiClientResponse<T>> => {

    const fullUrl = new URL(
        url,
        process.env.NEXT_PUBLIC_STRAPI_API_URL
    );

    // Locale handling (i18n)
    if (options?.lang) {
        fullUrl.searchParams.set('locale', options.lang);
    }

    const method = options?.method || 'GET';
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.jwt && {
            Authorization: `Bearer ${options.jwt}`,
        }),
        ...(options?.headers || {}),
    };

    const fetchOptions: RequestInit & {
        next?: {
            tags?: string[];
            revalidate?: number;
        };
    } = {
        method,
        headers,
        cache:
            options?.cache ??
            (method === 'GET' ? 'force-cache' : 'no-store'),
        next: options?.next,
    };


    // Add body for POST, PUT, PATCH requests
    if (hasBody && options?.body) {
        fetchOptions.body = typeof options.body === 'string'
            ? options.body
            : JSON.stringify(options.body);
    }

    try {
        const res = await fetch(fullUrl.toString(), fetchOptions);

        // Parse response
        let json: any = null;
        const contentType = res.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            try {
                json = await res.json();
            } catch (e) {
                // Response is not valid JSON
                console.error('Failed to parse JSON response:', e);
            }
        }

        // Handle non-OK responses
        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                meta: null,
                error: json?.error || { message: `Request failed with status ${res.status}` }
            };
        }

        return {
            ok: true,
            status: res.status,
            data: json?.data ?? null,
            meta: json?.meta ?? null
        };

    } catch (error: any) {
        console.error('Strapi client error:', error);
        return {
            ok: false,
            status: 500,
            data: null,
            meta: null,
            error: { message: error.message || 'Network error occurred' }
        };
    }
};