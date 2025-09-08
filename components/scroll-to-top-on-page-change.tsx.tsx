"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToTopOnPageChange() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      // Smooth scroll to the top once the new page content is mounted
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchParams]);

  return null;
}
