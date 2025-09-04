import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4 mt-10">Your Dreams</h2>
        <div className="flex flex-col gap-6 w-full">
          {dreams.map((dream) => (
            <Card
              key={dream.id}
              className="rounded-md border bg-background text-foreground shadow-sm"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {dream.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {dream.mood}
                    </Badge>
                    {dream.lucidity && (
                      <Badge className="bg-blue-100 text-blue-700">Lucid</Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(dream.dream_date), "PPP")}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground">
                  {dream.content}
                </p>
                {/* Emotions */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Emotions</span>
                  {Array.isArray(dream.emotions) && dream.emotions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {dream.emotions.map((em) => (
                        <Badge key={em} variant="secondary" className="text-xs capitalize">
                          {em}
                        </Badge>
                      ))}
                    </div>
                  ) : dream.emotions ? (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {String(dream.emotions)}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                )}
                </div>
                {/* {dream.emotions && dream.emotions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dream.emotions.map((emotion, index) => (
                    <Badge key={index} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
                )} */}


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
                </div>
);
}
