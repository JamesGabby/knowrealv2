"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function MoodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMood = searchParams.get("mood") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);

    if (e.target.value) {
      params.set("mood", e.target.value);
    } else {
      params.delete("mood");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <select
      className="border rounded-md px-2 py-1 text-sm bg-background"
      value={currentMood}
      onChange={handleChange}
    >
      <option value="">All moods</option>
      <option value="positive">😊 Positive</option>
      <option value="neutral">😐 Neutral</option>
      <option value="negative">😞 Negative</option>
    </select>
  );
}
