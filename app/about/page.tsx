import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-primary/20 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Link href="/">← Back</Link>
            </Button>
            <h1 className="text-white font-bold text-lg">About Us</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="max-w-sm mx-auto space-y-6">
          <Card className="border-0 shadow-xl bg-white rounded-3xl">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto mb-4 p-3">
                <Image
                  src="/logo.png"
                  alt="Westlert Frames"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">Westlert Digitals</h2>
              <p className="text-muted-foreground mb-4">Premium Custom Picture Framing</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-primary">📍 Location</p>
                <p className="text-muted-foreground">Moses Armah Market Building, Room 75</p>
                <p className="text-muted-foreground">Bibiani, Western North Region, Ghana</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white rounded-3xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4 text-center">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Phone Numbers</p>
                    <div className="space-y-1">
                      <a href="tel:0552662474" className="block text-muted-foreground hover:text-primary">
                        0552662474
                      </a>
                      <a href="tel:0539210458" className="block text-muted-foreground hover:text-primary">
                        0539210458
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">WhatsApp Orders</p>
                    <a href="https://wa.me/233539210458" className="text-muted-foreground hover:text-primary">
                      0539210458
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white rounded-3xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4 text-center">Our Services</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🖼️</span>
                  <span className="text-muted-foreground">Custom Picture Framing</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎨</span>
                  <span className="text-muted-foreground">Professional Photo Mounting</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">✨</span>
                  <span className="text-muted-foreground">Premium Frame Materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚚</span>
                  <span className="text-muted-foreground">Local Delivery Available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-2xl py-6 text-lg font-bold shadow-xl"
          >
            <Link href="/order">Start Your Custom Frame</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
