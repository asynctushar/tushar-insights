"use client";

import { Search } from 'lucide-react';

interface SearchSuggestionsProps {
    suggestions: string[];
    show: boolean;
    onSelect: (suggestion: string) => void;
    isMobile?: boolean;
}

const SearchSuggestions = ({ suggestions, show, onSelect, isMobile = false }: SearchSuggestionsProps) => {
    if (!show || suggestions.length === 0) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-md shadow-lg overflow-hidden z-50 text-foreground">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onSelect(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-2"
                >
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                </button>
            ))}
        </div>
    );
};

export default SearchSuggestions;