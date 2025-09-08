"use client";

import { useRouter } from "next/navigation";

type PaginationProps = {
  page: number;
  totalPages: number;
  query: string;
  lucid: boolean;
};

export default function Pagination({ page, totalPages, query, lucid }: PaginationProps) {
  const router = useRouter();

  const goToPage = (p: number) => {
    router.push(
      `?q=${encodeURIComponent(query)}&page=${p}${lucid === true ? "&lucid=true" : ""}`,
      { scroll: false }
    );
  };

  return (
    <div className="flex justify-center gap-2 mt-8">
      {page > 1 && (
        <button
          onClick={() => goToPage(page - 1)}
          className="px-3 py-2 border rounded-md hover:bg-accent"
        >
          Previous
        </button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-2 border rounded-md ${
            p === page
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          {p}
        </button>
      ))}

      {page < totalPages && (
        <button
          onClick={() => goToPage(page + 1)}
          className="px-3 py-2 border rounded-md hover:bg-accent"
        >
          Next
        </button>
      )}
    </div>
  );
}
