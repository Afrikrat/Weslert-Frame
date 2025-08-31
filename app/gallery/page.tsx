"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Grid3X3, Heart, Share2, Eye } from "lucide-react"
import Image from "next/image"
import type { FrameStyle } from "@/lib/types"
import { formatCurrency } from "@/lib/types"

export default function GalleryPage() {
  const [frameStyles, setFrameStyles] = useState<FrameStyle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    fetchFrameStyles()
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("frame-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const fetchFrameStyles = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("frame_styles").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching frame styles:", error)
    } else {
      setFrameStyles(data || [])
    }
    setIsLoading(false)
  }

  const toggleFavorite = (frameId: string) => {
    const newFavorites = favorites.includes(frameId)
      ? favorites.filter((id) => id !== frameId)
      : [...favorites, frameId]

    setFavorites(newFavorites)
    localStorage.setItem("frame-favorites", JSON.stringify(newFavorites))
  }

  const shareFrame = async (frame: FrameStyle) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${frame.name} - Westlert Frames`,
          text: `Check out this beautiful ${frame.name} frame!`,
          url: window.location.origin + `/order?frame=${frame.id}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/order?frame=${frame.id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-4">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Grid3X3 className="h-6 w-6 text-amber-700" />
          <h1 className="text-2xl font-bold text-gray-900">Frame Gallery</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frameStyles.map((frame) => (
            <Card key={frame.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={
                    frame.mockup_url || frame.image_url || "/placeholder.svg?height=300&width=300&query=picture frame"
                  }
                  alt={frame.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    onClick={() => toggleFavorite(frame.id)}
                    variant="secondary"
                    size="sm"
                    className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(frame.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                  <Button
                    onClick={() => shareFrame(frame)}
                    variant="secondary"
                    size="sm"
                    className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{frame.name}</h3>
                  <Badge variant="outline" className="text-amber-700 border-amber-200">
                    {formatCurrency(frame.base_price)}
                  </Badge>
                </div>
                {frame.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{frame.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {frame.material && <span>{frame.material}</span>}
                    {frame.color && <span>• {frame.color}</span>}
                  </div>
                  <Button asChild size="sm" className="bg-amber-700 hover:bg-amber-800">
                    <a href={`/order?frame=${frame.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Order
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
