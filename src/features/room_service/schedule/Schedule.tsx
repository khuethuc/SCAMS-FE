"use client";

import { useEffect, useMemo, useState } from "react";
import { BookingCard } from "@/components/BookingCard";
import { Pagination } from "@/components/Pagination";
import { ScheduleProps } from "@/type/type";

export function Schedule({ items, pageSize = 5, searchTerm }: ScheduleProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [currentUser, setCurrentUser] = useState<{
    id: string | null;
    email: string | null;
    role: string | null;
  }>({ id: null, email: null, role: null });

  useEffect(() => {
    const syncUser = () => {
      const id = localStorage.getItem("userId");
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      setCurrentUser({ id, email, role });
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

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
      {/* Booking list */}
      <div className="space-y-3">
        {pageItems.map((item: any, index) => {
          const isOwner =
            typeof item.userId === "string" &&
            typeof currentUser.id === "string" &&
            item.userId.trim() !== "" &&
            currentUser.id.trim() !== "" &&
            item.userId === currentUser.id;

          const canManage = Boolean(item.onEdit && item.onDelete && isOwner);

          return <BookingCard key={index} {...item} canManage={canManage} />;
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        siblingCount={1}
      />
    </div>
  );
}
