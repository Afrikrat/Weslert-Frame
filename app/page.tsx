import { createClient } from "@/lib/supabase/server"
import type { FrameStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PWAInstall } from "@/components/pwa-install"
import Link from "next/link"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch frame styles from database
  const { data: frameStyles, error } = await supabase
    .from("frame_styles")
    .select("*")
    .order("base_price", { ascending: true })

  if (error) {
    console.error("Error fetching frame styles:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-primary/20 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl p-2 shadow-xl">
                <Image
                  src="/logo.png"
                  alt="Westlert Frames"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-tight">Westlert Frames</h1>
                <p className="text-white/80 text-sm">Premium Custom Framing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5"></div>
        <div className="relative max-w-sm mx-auto text-center">
          <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl mx-auto mb-8 p-4 border-4 border-primary/10">
            <Image
              src="/logo.png"
              alt="Westlert Frames"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4 leading-tight">Transform Your Memories</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed px-2">
            Handcrafted custom frames that turn your photos into stunning wall art
          </p>
          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-2xl rounded-2xl py-7 text-lg font-bold transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/order">🖼️ Start Custom Frame</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-2 border-primary/30 hover:bg-primary/10 rounded-2xl py-7 text-lg font-semibold bg-white/80 backdrop-blur-sm"
            >
              <Link href="#gallery">Browse Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-2">Simple Process</h3>
            <p className="text-muted-foreground">Three easy steps to your perfect frame</p>
          </div>
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white rounded-3xl transform hover:scale-105 transition-all duration-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2 text-lg">Upload Photo</h4>
                  <p className="text-muted-foreground">Choose your favorite memory to frame</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white rounded-3xl transform hover:scale-105 transition-all duration-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-2xl">🖼️</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2 text-lg">Select Frame</h4>
                  <p className="text-muted-foreground">Pick from our premium collection</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white rounded-3xl transform hover:scale-105 transition-all duration-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2 text-lg">We Craft</h4>
                  <p className="text-muted-foreground">Expert handcrafted quality delivered</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="gallery" className="px-4 py-10 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-3">Frame Collection</h3>
            <p className="text-muted-foreground">Premium handcrafted frames starting from GH₵15</p>
          </div>

          {frameStyles && frameStyles.length > 0 ? (
            <div className="space-y-6">
              {frameStyles.slice(0, 6).map((frame: FrameStyle) => (
                <Card
                  key={frame.id}
                  className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-200"
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                        {frame.image_url ? (
                          <Image
                            src={frame.image_url || "/placeholder.svg"}
                            alt={frame.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div
                              className="w-20 h-16 border-4 rounded-lg bg-white shadow-lg"
                              style={{ borderColor: frame.color?.toLowerCase() || "#2D5016" }}
                            >
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-primary text-lg">{frame.name}</h4>
                          <Badge className="bg-gradient-to-r from-secondary to-secondary/80 text-primary font-bold text-sm px-3 py-1 rounded-full shadow-lg">
                            GH₵{frame.base_price}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {frame.material && (
                            <Badge
                              variant="outline"
                              className="text-xs border-primary/30 text-primary/80 rounded-full px-3 py-1 bg-primary/5"
                            >
                              {frame.material}
                            </Badge>
                          )}
                          {frame.color && (
                            <Badge
                              variant="outline"
                              className="text-xs border-primary/30 text-primary/80 rounded-full px-3 py-1 bg-primary/5"
                            >
                              {frame.color}
                            </Badge>
                          )}
                        </div>
                        <Button
                          asChild
                          size="sm"
                          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-2xl py-3 text-sm font-bold shadow-lg"
                        >
                          <Link href={`/order?frame=${frame.id}`}>Choose This Frame</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
              </div>
              <p className="text-muted-foreground">Loading our beautiful frames...</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary via-primary to-secondary px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-sm mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Create?</h3>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Join hundreds of satisfied customers across Ghana
          </p>
          <Button
            asChild
            size="lg"
            className="w-full bg-white text-primary hover:bg-white/90 shadow-2xl rounded-2xl py-7 text-xl font-bold transform hover:scale-105 transition-all duration-200"
          >
            <Link href="/order">🚀 Create Your Frame Now</Link>
          </Button>
        </div>
      </section>

      <PWAInstall />
    </div>
  )
}
