import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";
import { Sansation } from "next/font/google";

const sansation = Sansation({ weight: '400', subsets: ['latin'], fallback: ['mono'] });

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        {/* <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          rel="noreferrer"
        >
          <SupabaseLogo />
        </a>
        <span className="border-l rotate-45 h-6" />
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <NextLogo />
        </a> */}
        <h1 className={`${sansation.className} text-5xl font-mono`}>KNOW REAL</h1>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-xl lg:text-2xl !leading-tight mx-auto max-w-xl text-center">
        Get to know{" "}
        <span className="font-bold">
          <code>Reality</code>
        </span>.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
