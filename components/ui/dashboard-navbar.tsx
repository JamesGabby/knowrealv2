"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "../logout-button"
import { Home, MoonStar, Brain, UsersRound, Info, Menu, X } from "lucide-react"
import { Sansation } from "next/font/google"
import useWindowWidth from "../../hooks/use-window-width"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const sansation = Sansation({ weight: "700", subsets: ["latin"], fallback: ["mono"] })

const navItems = [
  { href: "/protected", label: "Home", icon: Home },
  { href: "/protected/dreams", label: "Dreams", icon: MoonStar },
  { href: "/protected/meditation", label: "Meditation", icon: Brain },
  { href: "/protected/obe", label: "OBE", icon: UsersRound },
  { href: "/protected/info", label: "Info", icon: Info },
]

export default function DashboardNavbar() {
  const pathname = usePathname()
  const width = useWindowWidth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (width && width >= 710) setOpen(false)
  }, [width])

  return (
    <nav className="relative flex items-center justify-between px-6 py-3 border-b shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/" className={`${sansation.className}`}>KNOW REAL</Link>
      </div>

      {/* Middle: Nav links (visible on larger screens) */}
      {width && width >= 710 && (
        <div className="flex items-center space-x-6">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === pathname || href.includes('/dreams') && pathname.includes('/dreams')
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isActive ? "text-indigo-300" : "hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Right: Mobile Menu Toggle + Logout */}
      <div className="flex items-center space-x-4">
        {width && width < 710 && (
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <LogoutButton />
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {open && width && width < 710 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-white text-gray-900 dark:bg-zinc-900 dark:text-white"
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <Link href="/" className={`${sansation.className} text-lg`} onClick={() => setOpen(false)}>
                KNOW REAL
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-xl">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = href === pathname || href.includes('dreams') && pathname.includes('dreams')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 ${
                      isActive ? "text-indigo-400" : "hover:text-gray-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}