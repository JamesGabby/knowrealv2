import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SearchBox from '@/components/search-box';
import LucidSwitch from '@/components/lucid-switch';
import Pagination from '@/components/pagination';
import Footer from '@/components/ui/footer';

// Add SearchParams type
type DreamsProps = {
  searchParams: { page?: string; q?: string; lucid?: string }
};

export default async function Dreams({ searchParams }: DreamsProps) {
  const supabase = await createClient();

  const params = await searchParams;

  const lucid = params.lucid === "true";
  const query = params.q?.trim() ?? "";
  const page = parseInt(params.page ?? "1", 10);

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Pagination setup
  const pageSize = 6;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let supabaseQuery = supabase
    .from("dreams")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("dream_date", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%,notes.ilike.%${query}%`
    );
  }

  // ✅ use the normalized boolean
  if (lucid) {
    supabaseQuery = supabaseQuery.eq("lucidity", true);
  }

  const { data: dreams, error: dreamsError, count } = await supabaseQuery.range(from, to);

  if (dreamsError) {
    console.error(dreamsError);
    return <p>Error loading dreams</p>;
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  type Mood = 'positive' | 'negative' | 'neutral';
  function dreamMood(mood: Mood) {
    if (mood == 'positive') return 'bg-green-500'
    if (mood == 'negative') return 'bg-red-500'
    return 'bg-blue-300'
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4 mt-10">Your Dreams</h2>

        {/* 🔎 Search Bar + Lucid Filter */}
        <div className="w-full mb-6 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <SearchBox />
          <LucidSwitch />
        </div>

        {/* Grid of dreams */}
        <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {dreams.length > 0 ? (
            dreams.map((dream) => (
              <Card
                key={dream.id}
                className="rounded-md border bg-background text-foreground shadow-sm flex flex-col"
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg font-semibold">
                      {dream.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={`relative inline-flex items-center justify-center p-[3px] overflow-hidden font-medium rounded-lg ${dreamMood(dream.mood)} pointer-events-none`}
                      >
                        <span className="relative px-3 py-1 text-xs rounded-md bg-background text-foreground capitalize">
                          {dream.mood}
                        </span>
                      </Badge>

                      {dream.lucidity && (
                        <Badge className="relative inline-flex items-center justify-center p-[3px] overflow-hidden font-medium rounded-lg bg-[length:300%_300%] bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 animate-gradient-border">
                          <span className="relative px-3 py-1 rounded-md bg-gray-900 text-white">
                            Lucid
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(dream.dream_date), "PPP")}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm leading-relaxed text-foreground">
                    {dream.content}
                  </p>

                  {/* Emotions */}
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">Emotions</span>
                    {dream.emotions ? (
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(dream.emotions)
                          ? dream.emotions
                          : String(dream.emotions).split(",").map((e) => e.trim())
                        ).map((em) => (
                          <Badge
                            key={em}
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {em}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {dream.notes && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Notes: {dream.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No dreams found.</p>
          )}
        </div>
      </div>

      {/* 🔄 Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          query={query}
          lucid={lucid}  // ✅ normalize before passing
        />
      )}
      <Footer />
    </div>
  );
}
