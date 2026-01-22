"use client";

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
    onClick: () => void;
}

const SearchButton = ({ onClick }: SearchButtonProps) => {
    return (
        <Button
            variant="default"
            size="icon"
            onClick={onClick}
            aria-label="Search"
            className='hover:bg-primary-foreground/20'
        >
            <Search className="h-4 w-4" />
        </Button>
    );
};

export default SearchButton;