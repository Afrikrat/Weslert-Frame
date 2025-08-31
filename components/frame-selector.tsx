"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FrameStyle, FrameSize } from "@/lib/types"
import { FRAME_SIZES } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface FrameSelectorProps {
  frameStyles: FrameStyle[]
  preselectedFrameId?: string
}

export function FrameSelector({ frameStyles, preselectedFrameId }: FrameSelectorProps) {
  const [selectedFrameId, setSelectedFrameId] = useState<string>(preselectedFrameId || "")
  const [selectedSize, setSelectedSize] = useState<FrameSize>("8x10")
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const selectedFrame = frameStyles.find((frame) => frame.id === selectedFrameId)

  // Calculate total price when frame or size changes
  useEffect(() => {
    if (selectedFrame) {
      const sizeMultiplier = FRAME_SIZES[selectedSize].multiplier
      const calculatedPrice = selectedFrame.base_price * sizeMultiplier
      setTotalPrice(calculatedPrice)
    }
  }, [selectedFrame, selectedSize])

  // Set first frame as default if no preselection
  useEffect(() => {
    if (!selectedFrameId && frameStyles.length > 0) {
      setSelectedFrameId(frameStyles[0].id)
    }
  }, [frameStyles, selectedFrameId])

  if (frameStyles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No frame styles available.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Frame Selection */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Choose Your Frame Style</h2>
        <div className="grid gap-4">
          {frameStyles.map((frame) => (
            <Card
              key={frame.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedFrameId === frame.id
                  ? "ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/20"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedFrameId(frame.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded flex-shrink-0 relative overflow-hidden">
                    {frame.image_url ? (
                      <Image
                        src={frame.image_url || "/placeholder.svg"}
                        alt={frame.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div
                          className="w-12 h-8 border-2 rounded-sm bg-white dark:bg-gray-100"
                          style={{ borderColor: frame.color?.toLowerCase() || "#8B4513" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{frame.name}</h3>
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        ${frame.base_price}
                      </Badge>
                    </div>
                    {frame.description && <p className="text-sm text-muted-foreground mb-2">{frame.description}</p>}
                    <div className="flex flex-wrap gap-1">
                      {frame.material && (
                        <Badge variant="outline" className="text-xs">
                          {frame.material}
                        </Badge>
                      )}
                      {frame.color && (
                        <Badge variant="outline" className="text-xs">
                          {frame.color}
                        </Badge>
                      )}
                      {frame.width_inches && (
                        <Badge variant="outline" className="text-xs">
                          {frame.width_inches}" width
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Size Selection & Preview */}
      <div className="lg:sticky lg:top-8">
        <div className="space-y-6">
          {/* Size Selection */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Choose Size</h3>
              <RadioGroup value={selectedSize} onValueChange={(value) => setSelectedSize(value as FrameSize)}>
                <div className="space-y-3">
                  {Object.entries(FRAME_SIZES).map(([size, { label, multiplier }]) => (
                    <div key={size} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={size} id={size} />
                        <Label htmlFor={size} className="font-medium">
                          {label}
                        </Label>
                      </div>
                      {selectedFrame && (
                        <span className="text-sm text-muted-foreground">
                          ${(selectedFrame.base_price * multiplier).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Preview */}
          {selectedFrame && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Preview</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 text-center">
                  <div className="inline-block relative">
                    <div
                      className="border-8 rounded-sm shadow-lg bg-white dark:bg-gray-100 p-4"
                      style={{ borderColor: selectedFrame.color?.toLowerCase() || "#8B4513" }}
                    >
                      <div
                        className="bg-gray-200 dark:bg-gray-300 rounded-sm flex items-center justify-center text-gray-500 text-sm"
                        style={{
                          width:
                            selectedSize === "8x10"
                              ? "120px"
                              : selectedSize === "11x14"
                                ? "140px"
                                : selectedSize === "16x20"
                                  ? "160px"
                                  : selectedSize === "18x24"
                                    ? "180px"
                                    : "200px",
                          height:
                            selectedSize === "8x10"
                              ? "150px"
                              : selectedSize === "11x14"
                                ? "175px"
                                : selectedSize === "16x20"
                                  ? "200px"
                                  : selectedSize === "18x24"
                                    ? "240px"
                                    : "300px",
                        }}
                      >
                        Your Photo Here
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Frame Style:</span>
                    <span className="font-medium">{selectedFrame.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Size:</span>
                    <span className="font-medium">{FRAME_SIZES[selectedSize].label}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total Price:</span>
                    <span className="text-amber-700 dark:text-amber-400">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          <Button asChild size="lg" className="w-full bg-amber-700 hover:bg-amber-800" disabled={!selectedFrameId}>
            <Link href={`/order/upload?frame=${selectedFrameId}&size=${selectedSize}&price=${totalPrice.toFixed(2)}`}>
              Continue to Upload Photo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
