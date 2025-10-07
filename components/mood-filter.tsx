"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Smile, Meh, Frown } from "lucide-react";

export default function MoodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMood = searchParams.get("mood") || "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("mood");
    } else {
      params.set("mood", value);
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <Select onValueChange={handleChange} value={currentMood}>
      <SelectTrigger className="w-[160px] bg-background border rounded-xl text-sm focus:ring-2 focus:ring-primary/30 transition-all">
        <SelectValue placeholder="Select mood" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All moods</SelectItem>
        <SelectItem value="positive">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-green-500" /> Positive
          </div>
        </SelectItem>
        <SelectItem value="neutral">
          <div className="flex items-center gap-2">
            <Meh className="w-4 h-4 text-yellow-500" /> Neutral
          </div>
        </SelectItem>
        <SelectItem value="negative">
          <div className="flex items-center gap-2">
            <Frown className="w-4 h-4 text-red-500" /> Negative
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
