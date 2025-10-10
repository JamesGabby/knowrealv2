import CTASection from "@/components/cta-section";
import FeatureSection from "@/components/feature-section";
import { Hero } from "@/components/hero";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import Footer from "@/components/ui/footer";
import PublicNavbar from "@/components/ui/public-navbar";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import { Sansation } from "next/font/google";

const sansation = Sansation({
  weight: "700",
  subsets: ["latin"],
  fallback: ["mono"],
});

export default async function Home() {
  const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  return (
    <>
      <PublicNavbar />
      <Hero data={user} />
      
      {/* Meditation Course Section */}
      <FeatureSection
        id="meditation"
        title="Free Meditation Course"
        subtitle="Calm your mind and discover deep inner peace."
        description="Access a complete meditation course — free forever. Learn practical techniques, guided sessions, and tools to help you establish mindfulness and balance. Step-by-step video tutorials and progress tracking included."
        image="https://images.unsplash.com/photo-1577344718665-3e7c0c1ecf6b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        features={[
          "Guided meditation sessions",
          "Mindfulness techniques & breathing tools",
          "Progress tracking & journaling",
          "Lifetime free access"
        ]}
        ctaText="Start the Free Course"
        ctaLink="/meditation"
        reverse
      />

      {/* Lucid Dreaming Section */}
      <FeatureSection
        id="lucid-dreaming"
        title="Lucid Dreaming Suite"
        subtitle="Explore your dreams consciously and securely."
        description="Record and analyze your dreams with our fully encrypted dream journaling system. Filter, tag, and visualize patterns to gain insights into your subconscious mind."
        image="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg"
        features={[
          "End-to-end encrypted dream journaling",
          "Powerful search & filtering system",
          "Visualize trends and statistics",
          "Customizable tags and dream symbols"
        ]}
        ctaText="Explore Lucid Dreaming"
        ctaLink="/lucid-dreaming"
      />

      {/* Out of Body Experience Section */}
      <FeatureSection
        id="obe"
        title="Out of Body Experiences"
        subtitle="Unlock the potential of consciousness beyond the physical body."
        description="Learn safe and effective techniques to induce and navigate out-of-body states. Access comprehensive tools, guided instructions, and community support to expand your awareness."
        image="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        features={[
          "Step-by-step OBE induction techniques",
          "Audio & visual guidance tools",
          "Safety instructions and preparation tips",
          "Community support and progress tracking"
        ]}
        ctaText="Learn OBE Techniques"
        ctaLink="/obe"
        reverse
      />

      <CTASection />
      {/* <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 pt-36">
            <main className="flex-1 flex flex-col gap-6 px-4">
              <h2 className={`font-medium text-xl mb-4 ${sansation.className}`}>EXPLORE THE WORLD OF DREAMS</h2>
              {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
            </main>
          </div>
        </div>
        
      </main> */}
      <Footer />
    </>
  );
}
