"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
        params.set("page", "1"); // reset to first page when searching
      } else {
        params.delete("q");
      }
      router.push("?" + params.toString());
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [value, router, searchParams]);

  return (
    <input
      type="text"
      placeholder="Search dreams..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full px-3 py-2 border rounded-md"
    />
  );
}
