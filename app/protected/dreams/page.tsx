import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SearchBox from '@/components/search-box';
import LucidSwitch from '@/components/lucid-switch';
import Pagination from '@/components/pagination';
import Footer from '@/components/ui/footer';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Frown, Meh, Pencil, Plus, Smile, Trash2 } from 'lucide-react';
import { deleteDream } from '@/app/actions/delete-dream';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import AIModeButton from '@/components/rainbow-button';
import MoodFilter from '@/components/mood-filter';


type DreamsProps = {
  searchParams: { page?: string; q?: string; lucid?: string; mood?: string }
};

export default async function Dreams({ searchParams }: DreamsProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const lucid = params.lucid === "true";
  const query = params.q?.trim() ?? "";
  const page = parseInt(params.page ?? "1", 10);
  const mood = params.mood?.trim() ?? ""; // 🆕 new param

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const pageSize = 6;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let supabaseQuery = supabase
    .from("dreams")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("dream_date_time", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%,notes.ilike.%${query}%`
    );
  }

  if (lucid) {
    supabaseQuery = supabaseQuery.eq("lucidity", true);
  }

  // 🆕 Mood filtering
  if (mood) {
    supabaseQuery = supabaseQuery.eq("mood", mood);
  }

  const { data: dreams, error: dreamsError, count } = await supabaseQuery.range(from, to);

  if (dreamsError) {
    console.error(dreamsError);
    return <p>Error loading dreams</p>;
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  type Mood = 'positive' | 'negative' | 'neutral';
  function dreamMood(mood: Mood) {
    if (mood == 'positive') return 'bg-green-500';
    if (mood == 'negative') return 'bg-red-500';
    return 'bg-blue-300';
  }

  function dreamMoodEmote(mood: Mood) {
    if (mood == 'positive') return <Smile size={18} color='lightgreen' />;
    if (mood == 'negative') return <Frown size={18} color='red' />;
    return <Meh size={18} color='lightblue' />;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4 mt-10">Your Dreams</h2>

        {/* 🔎 Search + Lucid + Mood Filter + Add */}
        <div className="w-full mb-6 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center w-full">
            <SearchBox />
            <MoodFilter />
            <LucidSwitch />
            <Link href="dreams/create">
              <Button><Plus />Add New</Button>
            </Link>
          </div>
        </div>

        {/* Dreams Grid */}
        <div className="grid gap-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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

                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`inline-flex items-center bg-transparent`}>
                          {dreamMoodEmote(dream.mood)}
                        </Badge>
                        {dream.lucidity && (
                          <AIModeButton />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/protected/dreams/${dream.id}/edit`}>
                          <Button variant="outline" className="flex items-center gap-1 h-7 w-7">
                            <Pencil size={0} />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="flex items-center gap-1 h-7 w-7"
                            >
                              <Trash2 size={6} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this dream?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form action={deleteDream.bind(null, dream.id)}>
                                <AlertDialogAction
                                  type="submit"
                                  className="bg-red-600 text-white hover:bg-red-700 w-full"
                                >
                                  Delete
                                </AlertDialogAction>
                              </form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(dream.dream_date_time), "PPP • p")}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm leading-relaxed text-foreground">
                    {dream.content}
                  </p>

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

      {/* 🔄 Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          query={query}
          lucid={lucid}
          mood={mood} // 🆕 pass along
        />
      )}
      <Footer />
    </div>
  );
}
