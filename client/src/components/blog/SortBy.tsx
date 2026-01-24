"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
    { value: "title:asc", label: "Title (A to Z)" },
    { value: "title:desc", label: "Title (Z to A)" },
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
];

const SortBy = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "title:asc";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.delete("page");
        router.push(`/blogs?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-45">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SortBy;