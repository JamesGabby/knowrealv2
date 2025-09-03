import { Geist } from "next/font/google";
import "../../app/globals.css";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { Sansation } from "next/font/google";

const sansation = Sansation({ weight: '700', subsets: ['latin'], fallback: ['mono']});

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function PublicNavbar() {
  return (
    <nav className={`${geistSans.className} antialiased w-full flex justify-center border-b border-b-foreground/10 h-16`}>
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"} className={`${sansation.className}`}>KNOW REAL</Link>
          </div>
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </div>
    </nav>
  );
}
