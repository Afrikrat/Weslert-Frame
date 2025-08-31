import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Home, Phone, MessageCircle } from "lucide-react"
import { FRAME_SIZES } from "@/lib/types"
import type { FrameSize } from "@/lib/types"
import { generateWhatsAppOrderMessage, generateWhatsAppLink } from "@/lib/services/whatsapp"

interface SuccessPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const orderId = params.id

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Fetch order details with frame style
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      frame_styles (*)
    `)
    .eq("id", orderId)
    .single()

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const whatsappMessage = generateWhatsAppOrderMessage({
    orderId: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    frameName: order.frame_styles.name,
    frameSize: FRAME_SIZES[order.frame_size as FrameSize].label,
    totalPrice: order.total_price,
    paymentMethod: order.payment_method,
    notes: order.notes || undefined,
  })

  // Admin WhatsApp number - you should set this in your environment variables
  const adminWhatsApp = process.env.ADMIN_WHATSAPP_NUMBER || "+1234567890"
  const whatsappLink = generateWhatsAppLink(adminWhatsApp, whatsappMessage)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your order. Please send us a WhatsApp message to confirm your order details.
          </p>

          <Card className="text-left mb-8 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <MessageCircle className="w-5 h-5" />
                Send WhatsApp Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to send us your order details via WhatsApp. This helps us confirm your order and
                start processing it immediately.
              </p>
              <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Order via WhatsApp
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Order Details Card */}
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Order Details
                <Badge variant="secondary">#{order.id.slice(0, 8)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{order.customer_name}</p>
                    <p>{order.customer_email}</p>
                    <p>{order.customer_phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Frame Details</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{order.frame_styles.name}</p>
                    <p>{FRAME_SIZES[order.frame_size as FrameSize].label}</p>
                    <p className="font-medium text-foreground">${order.total_price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <Badge variant="outline">
                  {order.payment_method === "cash_on_delivery" && "Cash on Delivery"}
                  {order.payment_method === "bank_transfer" && "Bank Transfer"}
                  {order.payment_method === "online_payment" && "Online Payment"}
                </Badge>
              </div>

              {order.notes && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">1</span>
                </div>
                <div>
                  <p className="font-medium">Send WhatsApp Message</p>
                  <p className="text-sm text-muted-foreground">
                    Click the WhatsApp button above to send us your order details
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">2</span>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">
                    We'll confirm your order and start preparing your custom frame
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">3</span>
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    We'll contact you when your frame is ready for pickup/delivery
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-700 hover:bg-amber-800">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="tel:+1234567890">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
