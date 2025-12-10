"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationProps, PageItem } from "@/type/type";

function createPages(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PageItem[] {
  const pages: PageItem[] = [];

  const startPage = Math.max(2, currentPage - siblingCount);
  const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

  pages.push(1);

  if (startPage > 2) {
    pages.push("dots");
  }

  for (let p = startPage; p <= endPage; p++) {
    pages.push(p);
  }

  if (endPage < totalPages - 1) {
    pages.push("dots");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = createPages(currentPage, totalPages, siblingCount);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Prev */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
        className="rounded-xl"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Pages */}
      <div className="flex items-center gap-2">
        {pages.map((item, idx) =>
          item === "dots" ? (
            <span key={`dots-${idx}`} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <Button
              key={item}
              variant={item === currentPage ? "default" : "outline"}
              onClick={() => goTo(item)}
              className={`h-9 rounded-xl px-3 text-sm ${
                item === currentPage
                  ? "bg-[#155DFC] text-white hover:bg-[#155DFC]"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              {item}
            </Button>
          )
        )}
      </div>

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
        className="rounded-xl"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
