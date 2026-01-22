'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Search = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const lang = searchParams.get('lang') ?? 'en';
    const [value, setValue] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('q', value.trim());
        params.set('lang', lang);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="relative">
            <input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Search blogs..."
                className="input"
            />
            {/* Suggestions dropdown lives here */}
        </form>
    );
};

export default Search;
