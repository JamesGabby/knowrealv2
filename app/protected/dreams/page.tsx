import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function Dreams() {
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

  type Mood = 'positive' | 'negative' | 'neutral';

  function dreamMood(mood: Mood) {
    if (mood == 'positive') {
      return 'bg-green-500'
    } else if (mood == 'negative') {
      return 'bg-red-500'
    } else {
      return 'bg-blue-300'
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4 mt-10">Your Dreams</h2>

        {/* Responsive grid layout */}
        <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {dreams.map((dream) => (
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
                    {/* Mood Badge */}
                    <Badge className={`relative inline-flex items-center justify-center p-[3px] overflow-hidden font-medium rounded-lg ${dreamMood(dream.mood)} pointer-events-none`}>
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
                      {(
                        Array.isArray(dream.emotions)
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
          ))}
        </div>
      </div>
      {/* Debug JSON - hide on small screens */}
      <pre className="hidden lg:block">{JSON.stringify(dreams, null, 2)}</pre>
    </div>
  );
}
