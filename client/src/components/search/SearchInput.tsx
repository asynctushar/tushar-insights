"use client";

import { forwardRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onClear: () => void;
    isLoading?: boolean;
    placeholder?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value, onChange, onSubmit, onClear, isLoading = false, placeholder = "Search blogs..." }, ref) => {
        return (
            <form onSubmit={onSubmit} className="relative w-full md:w-64 bg-primary-foreground rounded-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    ref={ref}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="pl-9 pr-9 h-9 rounded-sm text-foreground dark:text-background" 
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!isLoading && value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={onClear}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                )}
            </form>
        );
    }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;