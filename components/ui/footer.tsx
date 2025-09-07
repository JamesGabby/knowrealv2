import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sansation } from "next/font/google";
const sansation = Sansation({ weight: '700', subsets: ['latin'], fallback: ['mono'] });

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p className={`${sansation.className}`}>
        KNOW REAL
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
