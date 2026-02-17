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

interface SortByProps {
    lang: string;
}

const SortBy = ({ lang }: SortByProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "title:asc";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.delete("page");

        // If lang is "bn", put it in the path
        const path = lang === "bn" ? `/blogs/bn` : "/blogs";

        return router.push(`${path}${params.toString() ? `?${params.toString()}` : ""}`);
    };

    return (
        <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full bg-background">
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
    );
};

export default SortBy;