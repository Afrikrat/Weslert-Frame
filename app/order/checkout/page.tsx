import { createClient } from "@/lib/supabase/server"
import { CheckoutForm } from "@/components/checkout-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { FrameSize } from "@/lib/types"

interface CheckoutPageProps {
  searchParams: Promise<{
    frame?: string
    size?: string
    price?: string
    image?: string
    caption?: string
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams
  const { frame: frameId, size, price, image, caption } = params

  if (!frameId || !size || !price || !image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Incomplete Order</h1>
          <p className="text-muted-foreground mb-4">Please complete all previous steps first.</p>
          <Button asChild>
            <Link href="/order">Start Over</Link>
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
  const imageUrl = decodeURIComponent(image)
  const captionText = caption ? decodeURIComponent(caption) : ""

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link
              href={`/order/upload?frame=${frameId}&size=${size}&price=${price}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your custom frame order</p>
          </div>
        </div>

        {/* Checkout Form */}
        <CheckoutForm
          frameStyle={frameStyle}
          frameSize={frameSize}
          totalPrice={totalPrice}
          imageUrl={imageUrl}
          captionText={captionText}
        />
      </div>
    </div>
  )
}
