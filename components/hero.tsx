import { Sansation } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { LogIn } from "lucide-react";
import Link from "next/link";

const sansation = Sansation({ weight: '700', subsets: ['latin'], fallback: ['mono'] });

export async function Hero() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <h1 className={`${sansation.className} text-5xl font-mono`}>KNOW REAL</h1>
      </div>
      <p className="text-xl lg:text-2xl !leading-tight mx-auto max-w-xl text-center">
        <code>Get to{"  "}
        <span className="font-bold">
          know
        </span>
        {" "}reality</code>.
      </p>
      <Link href={data ? '/protected' : '/auth/login'}>
        <LogIn />
      </Link>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
