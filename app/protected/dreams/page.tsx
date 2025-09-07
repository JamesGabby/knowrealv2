import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import SearchBox from '@/components/search-box';

// Add SearchParams type
type DreamsProps = {
  searchParams: { page?: string; q?: string }
};

export default async function Dreams({ searchParams }: DreamsProps) {
  const supabase = await createClient();

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Pagination setup
  const page = parseInt(searchParams.page ?? "1", 10);
  const pageSize = 6;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Search setup
  const query = searchParams.q?.trim() ?? "";

  let supabaseQuery = supabase
    .from("dreams")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("dream_date", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%`
    );
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

        {/* 🔎 Search Bar */}
        <div className="w-full mb-6">
          <SearchBox />
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
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="px-3 py-2 border rounded-md hover:bg-accent"
            >
              Previous
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?q=${encodeURIComponent(query)}&page=${p}`}
              className={`px-3 py-2 border rounded-md ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={`?q=${encodeURIComponent(query)}&page=${page + 1}`}
              className="px-3 py-2 border rounded-md hover:bg-accent"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
