"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "../logout-button"
import { Home, MoonStar, Brain, UsersRound, Info } from "lucide-react"
import { Sansation } from "next/font/google"
import useWindowWidth from "../../hooks/use-window-width";

const sansation = Sansation({ weight: '700', subsets: ['latin'], fallback: ['mono']});

const navItems = [
  { href: "/protected", label: "Home", icon: Home },
  { href: "/protected/dreams", label: "Dreams", icon: MoonStar },
  { href: "/protected/meditation", label: "Meditation", icon: Brain },
  { href: "/protected/obe", label: "OBE", icon: UsersRound },
  { href: "/protected/info", label: "Info", icon: Info },
]

export default function DashboardNavbar() {
  const pathname = usePathname()
  const width = useWindowWidth();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-black border-b border-gray-800 shadow-sm">
      {/* Left: Logo */}
      <div className={"flex items-center space-x-2"}>
        <Link href={"/"} className={`${sansation.className}`}>KNOW REAL</Link>
      </div>

      {/* Middle: Nav links */}
      <div className="flex items-center space-x-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                isActive ? "text-blue-400" : "text-gray-300 hover:text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{width && width < 710 ? '' : label}</span>
            </Link>
          )
        })}
      </div>

      {/* Right: Sign out */}
      <LogoutButton />
    </nav>
  )
}
