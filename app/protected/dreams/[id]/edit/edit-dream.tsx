import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default async function EditDream({ params }: { params: { id: string } }) {
  console.log("Editing dream with ID:", params.id);

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Fetch dream by ID
  const { data: dream, error: dreamError } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", await params.id)
    .eq("user_id", user.id)
    .single();

  if (dreamError || !dream) {
    redirect("/protected/dreams");
  }

  async function handleSubmit(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const dreamId = formData.get("dream_id") as string; // ✅ comes from hidden input

  const dreamDateRaw = formData.get("dream_date_time") as string;
  const localDate = new Date(dreamDateRaw);
  const dreamDate = localDate.toISOString();

  const updatedDream = {
    title: formData.get("title"),
    content: formData.get("content"),
    notes: formData.get("notes"),
    emotions: formData.get("emotions")?.toString().split(",").map(e => e.trim()),
    mood: formData.get("mood"),
    lucidity: formData.get("lucidity") === "on",
    dream_date_time: dreamDate,
  };

  const { error } = await supabase
    .from("dreams")
    .update(updatedDream)
    .eq("id", dreamId)       // ✅ now a real UUID
    .eq("user_id", user.id);

  if (!error) {
    redirect("/protected/dreams");
  } else {
    console.error(error);
  }
}


  return (
    <div className="flex-1 w-full flex flex-col gap-12 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4 mt-10">Edit Dream</h2>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dream Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="flex flex-col gap-6">
              <input type="hidden" name="dream_id" value={dream.id} />
              {/* Title */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={dream.title}
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="dream_date_time">Date & Time</Label>
                <Input
                  id="dream_date_time"
                  name="dream_date_time"
                  type="datetime-local"
                  defaultValue={new Date(dream.dream_date_time)
                    .toISOString()
                    .slice(0, 16)}
                  required
                />
              </div>

              {/* Dream Content */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="content">Dream Description</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={dream.content}
                  required
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={dream.notes || ""}
                />
              </div>

              {/* Emotions */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="emotions">Emotions (comma separated)</Label>
                <Input
                  id="emotions"
                  name="emotions"
                  defaultValue={dream.emotions?.join(", ") || ""}
                />
              </div>

              {/* Mood + Lucidity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mood">Overall Mood</Label>
                  <select
                    id="mood"
                    name="mood"
                    defaultValue={dream.mood || "neutral"}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <Checkbox
                    id="lucidity"
                    name="lucidity"
                    defaultChecked={dream.lucidity}
                  />
                  <Label htmlFor="lucidity">Lucid Dream</Label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" className="px-6">
                  Update Dream
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
