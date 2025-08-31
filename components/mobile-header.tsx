"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingBag } from "lucide-react"

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90 safe-area-inset-top shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Westlert Frames" width={40} height={40} className="rounded-lg" />
          <span className="font-bold text-lg text-primary-foreground">Westlert</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/order"
            className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            Order Frame
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            asChild
            size="sm"
            className="bg-secondary hover:bg-accent text-secondary-foreground touch-target rounded-full"
          >
            <Link href="/order">
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-white/10 touch-target rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-muted border-border">
              <div className="flex flex-col space-y-6 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors touch-target p-3 rounded-lg hover:bg-secondary/20"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/order"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors touch-target p-3 rounded-lg hover:bg-secondary/20"
                  onClick={() => setIsOpen(false)}
                >
                  Order Frame
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Button asChild className="bg-secondary hover:bg-accent text-secondary-foreground rounded-full px-6">
            <Link href="/order">Order Frame</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
