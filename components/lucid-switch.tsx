"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export default function LucidSwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lucid = searchParams.get("lucid") === "true";
  const q = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? "1";

  function handleToggle(checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("lucid", "true");
      params.set("page", "1");
    } else {
      params.delete("lucid");
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <Switch
        id="lucid-switch"
        checked={lucid}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-300"
      />
      <label
        htmlFor="lucid-switch"
        className="text-sm font-medium text-foreground select-none"
      >
        lucid
      </label>
    </div>
  );
}
