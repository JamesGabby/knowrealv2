"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteDream(dreamId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("dreams")
    .delete()
    .eq("id", dreamId)
    .eq("user_id", user.id); // make sure only the user's dreams are deleted

  if (error) {
    throw new Error(error.message);
  }

  // Revalidate the page where dreams are listed
  revalidatePath("/protected/dreams");
}
