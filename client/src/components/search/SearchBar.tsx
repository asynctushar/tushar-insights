"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchButton from './SearchButton';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { searchBlogSuggestions } from '@/services/blog.service';
import { BlogSuggestion } from '@/types/blog.type';
import { getLangFromLocale } from '@/lib/i18n';


interface SearchBarProps {
    isMobile?: boolean;
}


type LocaleParams = {
    locale?: string[];
};


const SearchBar = ({ isMobile = false }: SearchBarProps) => {
    const router = useRouter();
    const { locale } = useParams() as LocaleParams;
    const lang = getLangFromLocale(locale) || "en";

    const [value, setValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [suggestions, setSuggestions] = useState<BlogSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-focus input when expanded on mobile
    useEffect(() => {
        if (isExpanded && isMobile && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded, isMobile]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile]);

    // Debounced search suggestions (300ms)
    useEffect(() => {
        if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                // TODO: Replace with actual API call
                const result = await searchBlogSuggestions(value, lang);

                if (!result.ok) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }

                setSuggestions(result.data);
                setShowSuggestions(true);


            } catch (error) {
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(timer);
            setShowSuggestions(false);
            setIsLoading(false);
            setSuggestions([]);
        };
    }, [value, lang]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value.trim()) return;

        const params = new URLSearchParams();
        params.set('q', value.trim());

        // If lang is "bn", put it in the path
        const path = lang === "bn" ? `/search/bn` : "/search";

        setShowSuggestions(false);
        return router.push(`${path}${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const handleSuggestionClick = (suggestion: BlogSuggestion) => {
        setValue(suggestion.title);
        setShowSuggestions(false);

        const params = new URLSearchParams();
        params.set('q', suggestion.title);

        // If lang is "bn", put it in the path
        const path = lang === "bn" ? `/search/bn` : "/search";

        setShowSuggestions(false);
        return router.push(`${path}${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const handleClear = () => {
        setValue('');
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setValue('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Mobile collapsed state - show only search button
    if (isMobile && !isExpanded) {
        return <SearchButton onClick={handleExpand} />;
    }

    // Mobile expanded state - full screen overlay
    if (isMobile && isExpanded) {
        return (
            <div className="fixed inset-0 z-50">
                <div className="flex items-center p-3.5 gap-2 bg-primary">
                    <Button
                        variant="default"
                        size="icon"
                        onClick={handleCollapse}
                        aria-label="Close search"
                        className='hover:bg-primary-foreground/20'
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 relative" ref={containerRef}>
                        <SearchInput
                            ref={inputRef}
                            value={value}
                            onChange={setValue}
                            onSubmit={onSubmit}
                            onClear={handleClear}
                            isLoading={isLoading}
                        />

                        <SearchSuggestions
                            suggestions={suggestions}
                            show={showSuggestions}
                            onSelect={handleSuggestionClick}
                            isMobile
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Desktop view
    return (
        <div className="relative" ref={containerRef}>
            <SearchInput
                ref={inputRef}
                value={value}
                onChange={setValue}
                onSubmit={onSubmit}
                onClear={handleClear}
                isLoading={isLoading}
            />

            <SearchSuggestions
                suggestions={suggestions}
                show={showSuggestions}
                onSelect={handleSuggestionClick}
            />
        </div>
    );
};

export default SearchBar;