"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useWindowWidth from "@/hooks/use-window-width";
import { PowerOff } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const width = useWindowWidth();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return <Button onClick={logout}>{ width && width > 500 ? 'Logout' : <PowerOff size={2} color="red" />}</Button>;
}
