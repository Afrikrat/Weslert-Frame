import { createClient } from "@/lib/supabase/server"
import { ImageUploader } from "@/components/image-uploader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FRAME_SIZES } from "@/lib/types"
import type { FrameSize } from "@/lib/types"

interface UploadPageProps {
  searchParams: Promise<{ frame?: string; size?: string; price?: string }>
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const params = await searchParams
  const { frame: frameId, size, price } = params

  if (!frameId || !size || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Missing Selection</h1>
          <p className="text-muted-foreground mb-4">Please select a frame and size first.</p>
          <Button asChild>
            <Link href="/order">Go Back to Selection</Link>
          </Button>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Fetch the selected frame details
  const { data: frameStyle, error } = await supabase.from("frame_styles").select("*").eq("id", frameId).single()

  if (error || !frameStyle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Frame Not Found</h1>
          <p className="text-muted-foreground mb-4">The selected frame could not be found.</p>
          <Button asChild>
            <Link href="/order">Go Back to Selection</Link>
          </Button>
        </div>
      </div>
    )
  }

  const frameSize = size as FrameSize
  const totalPrice = Number.parseFloat(price)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/order?frame=${frameId}`} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Selection
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Upload Your Photo</h1>
            <p className="text-muted-foreground">Add your image and see how it looks in your frame</p>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-muted/30 rounded-lg p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Frame:</span>
              <Badge variant="secondary">{frameStyle.name}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Size:</span>
              <Badge variant="secondary">{FRAME_SIZES[frameSize].label}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Price:</span>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              >
                ${totalPrice.toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Image Upload Component */}
        <ImageUploader frameStyle={frameStyle} frameSize={frameSize} totalPrice={totalPrice} />
      </div>
    </div>
  )
}
