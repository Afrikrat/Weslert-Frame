"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Bell, User, Grid3X3 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    // Simulate notification count
    setNotifications(2)
  }, [])

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/order", icon: ShoppingBag, label: "Order" },
    { href: "/gallery", icon: Grid3X3, label: "Gallery" },
    { href: "/notifications", icon: Bell, label: "Alerts", badge: notifications },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-lg border-t border-secondary/30 px-2 py-2 safe-area-inset-bottom shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[60px] touch-target relative",
                isActive
                  ? "text-primary bg-secondary shadow-lg scale-110 transform"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-secondary/20 active:scale-95",
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-200",
                  isActive ? "text-primary font-semibold" : "text-primary-foreground/70",
                )}
              >
                {item.label}
              </span>
              {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
