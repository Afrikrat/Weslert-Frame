import { createClient } from "@/lib/supabase/server"
import { FrameSelector } from "@/components/frame-selector"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface OrderPageProps {
  searchParams: Promise<{ frame?: string }>
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch all frame styles
  const { data: frameStyles, error } = await supabase
    .from("frame_styles")
    .select("*")
    .order("base_price", { ascending: true })

  if (error) {
    console.error("Error fetching frame styles:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Frames</h1>
          <p className="text-muted-foreground mb-4">We couldn't load the frame styles. Please try again.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const preselectedFrameId = params.frame

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Your Custom Frame</h1>
            <p className="text-muted-foreground">Choose your frame style and size</p>
          </div>
        </div>

        {/* Frame Selection Component */}
        <FrameSelector frameStyles={frameStyles || []} preselectedFrameId={preselectedFrameId} />
      </div>
    </div>
  )
}
