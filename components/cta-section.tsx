import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="w-full py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white rounded-t-3xl">
      <h2 className="text-4xl font-bold mb-4">Begin Your Journey Within</h2>
      <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">
        Whether it’s mastering meditation, lucid dreaming, or exploring out-of-body states — your path to deeper awareness starts here.
      </p>
      <Button
        asChild
        className="bg-white text-indigo-700 hover:bg-indigo-100 font-semibold"
      >
        <a href="/signup">Join for Free</a>
      </Button>
    </section>
  );
}
