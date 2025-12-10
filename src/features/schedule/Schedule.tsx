"use client";

import { useMemo, useState } from "react";
import { BookingCard } from "@/components/BookingCard";
import { Pagination } from "@/components/Pagination";
import { ScheduleProps } from "@/type/type";

export function Schedule({ items, pageSize = 5 }: ScheduleProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white px-5 py-6 text-sm text-gray-500">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* List BookingCard */}
      <div className="space-y-3">
        {pageItems.map((item, index) => (
          <BookingCard key={index} {...item} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
