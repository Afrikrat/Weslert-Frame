"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { FrameStyle, FrameSize } from "@/lib/types"
import { FRAME_SIZES } from "@/lib/types"
import { submitOrder } from "@/lib/actions/orders"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, CreditCard, Banknote, Building2 } from "lucide-react"

interface CheckoutFormProps {
  frameStyle: FrameStyle
  frameSize: FrameSize
  totalPrice: number
  imageUrl: string
  captionText: string
}

export function CheckoutForm({ frameStyle, frameSize, totalPrice, imageUrl, captionText }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery")
  const router = useRouter()

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        frame_style_id: frameStyle.id,
        frame_size: frameSize,
        image_url: imageUrl,
        caption_text: captionText || null,
        total_price: totalPrice,
        payment_method: paymentMethod,
        notes: formData.notes || null,
      }

      const result = await submitOrder(orderData)

      if (result.success) {
        router.push(`/order/success?id=${result.orderId}`)
      } else {
        alert(result.error || "Failed to submit order. Please try again.")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      alert("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.customerName && formData.customerEmail && formData.customerPhone

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Order Form */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="cash_on_delivery" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">Pay when you receive your frame</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="bank_transfer" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-muted-foreground">Transfer to our bank account</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="online_payment" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Online Payment</div>
                        <div className="text-sm text-muted-foreground">Pay securely online</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special instructions or requests..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-amber-700 hover:bg-amber-800"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Order...
              </>
            ) : (
              "Complete Order"
            )}
          </Button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Frame Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-6 text-center">
              <div className="inline-block">
                <div
                  className="border-4 rounded-sm shadow-lg bg-white dark:bg-gray-100 p-1"
                  style={{ borderColor: frameStyle.color?.toLowerCase() || "#8B4513" }}
                >
                  <div className="relative w-32 h-40 overflow-hidden rounded-sm">
                    <Image src={imageUrl || "/placeholder.svg"} alt="Order preview" fill className="object-cover" />
                  </div>
                  {captionText && (
                    <div className="mt-1 text-xs text-gray-700 dark:text-gray-600 text-center font-medium">
                      {captionText.length > 20 ? `${captionText.substring(0, 20)}...` : captionText}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Frame Style:</span>
                <span className="text-sm font-medium">{frameStyle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Size:</span>
                <span className="text-sm font-medium">{FRAME_SIZES[frameSize].label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Material:</span>
                <span className="text-sm font-medium">{frameStyle.material || "Wood"}</span>
              </div>
              {captionText && (
                <div className="flex justify-between">
                  <span className="text-sm">Caption:</span>
                  <span className="text-sm font-medium">Included</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Base Price:</span>
                <span className="text-sm">${frameStyle.base_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Size Multiplier:</span>
                <span className="text-sm">×{FRAME_SIZES[frameSize].multiplier}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-amber-700 dark:text-amber-400">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Display */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-sm font-medium mb-1">Payment Method:</div>
              <Badge variant="secondary">
                {paymentMethod === "cash_on_delivery" && "Cash on Delivery"}
                {paymentMethod === "bank_transfer" && "Bank Transfer"}
                {paymentMethod === "online_payment" && "Online Payment"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
