import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Instruments() {
  const supabase = await createClient();

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Only fetch dreams for this user
  const { data: dreams, error: dreamsError } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id);

  if (dreamsError) {
    console.error(dreamsError);
    return <p>Error loading dreams</p>;
  }

  return <pre>{JSON.stringify(dreams, null, 2)}</pre>;
}
