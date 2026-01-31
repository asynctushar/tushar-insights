"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination as IPagination } from "@/types/blog.type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    pagination: IPagination;
}

const Pagination = ({ pagination }: PaginationProps) => {
    const searchParams = useSearchParams();
    const { page, pageCount } = pagination;

    const createUrl = (pageNum: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNum.toString());
        return `/blogs?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (pageCount <= maxVisible) {
            for (let i = 1; i <= pageCount; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(pageCount);
            } else if (page >= pageCount - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = pageCount - 3; i <= pageCount; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(pageCount);
            }
        }

        return pages;
    };

    if (pageCount <= 1) return null;

    return (
        <Card className="shadow-md">
            <CardContent className="">
                <div className="flex items-center justify-end gap-2 flex-wrap">
                    <Button
                        variant="default"
                        size="icon"
                        asChild={page > 1}
                        disabled={page <= 1}
                        className="disabled:opacity-70 px-7 cursor-pointer"
                    >
                        {page > 1 ? (
                            <Link href={createUrl(page - 1)}>
                                Prev
                            </Link>
                        ) : (
                            <>Prev</>
                        )}
                    </Button>

                    {getPageNumbers().map((pageNum, index) =>
                        typeof pageNum === "number" ? (
                            <Button
                                key={index}
                                variant={page === pageNum ? "secondary" : "outline"}
                                size="icon"
                                asChild={page !== pageNum}
                                disabled={page === pageNum}
                                className="disabled:opacity-80 border cursor-pointer"

                            >
                                {page !== pageNum ? (
                                    <Link href={createUrl(pageNum)}>{pageNum}</Link>
                                ) : (
                                    <span>{pageNum}</span>
                                )}
                            </Button>
                        ) : (
                            <span key={index} className="px-2 text-muted-foreground">
                                {pageNum}
                            </span>
                        )
                    )}

                    <Button
                        variant="default"
                        size="icon"
                        asChild={page < pageCount}
                        disabled={page >= pageCount}
                        className="disabled:opacity-70 px-7 cursor-pointer"
                    >
                        {page < pageCount ? (
                            <Link href={createUrl(page + 1)}>
                                Next
                            </Link>
                        ) : (
                            <>Next</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Pagination;