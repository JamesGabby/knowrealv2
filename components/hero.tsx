import { Sansation } from "next/font/google";

const sansation = Sansation({ weight: '700', subsets: ['latin'], fallback: ['mono'] });

export function Hero() {
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
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
