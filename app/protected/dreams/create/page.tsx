import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default async function Create() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  async function handleSubmit(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login");

    const dream = {
      user_id: user.id,
      title: formData.get("title"),
      content: formData.get("content"),
      notes: formData.get("notes"),
      emotions: formData.get("emotions")?.toString().split(",").map(e => e.trim()),
      mood: formData.get("mood"),
      lucidity: formData.get("lucidity") === "on",
      dream_date: formData.get("dream_date"),
    };

    const { error } = await supabase.from("dreams").insert(dream);

    if (!error) {
      redirect("/protected/dreams");
    } else {
      console.error(error);
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4 mt-10">Add a Dream</h2>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dream Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="flex flex-col gap-6">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="A short title for your dream" required />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="dream_date">Date</Label>
                <Input id="dream_date" name="dream_date" type="date" required />
              </div>

              {/* Dream Content */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="content">Dream Description</Label>
                <Textarea id="content" name="content" placeholder="Describe your dream in detail..." required />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Any extra thoughts, interpretations, or context..." />
              </div>

              {/* Emotions */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="emotions">Emotions (comma separated)</Label>
                <Input id="emotions" name="emotions" placeholder="happy, anxious, curious" />
              </div>

              {/* Mood + Lucidity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mood">Overall Mood</Label>
                  <select id="mood" name="mood" className="border rounded-md px-3 py-2">
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <Checkbox id="lucidity" name="lucidity" />
                  <Label htmlFor="lucidity">Lucid Dream</Label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" className="px-6">Save Dream</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
