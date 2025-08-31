"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ImageIcon } from "lucide-react"
import type { FrameStyle, FrameSize } from "@/lib/types"
import { FRAME_SIZES } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface ImageUploaderProps {
  frameStyle: FrameStyle
  frameSize: FrameSize
  totalPrice: number
}

export function ImageUploader({ frameStyle, frameSize, totalPrice }: ImageUploaderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [captionText, setCaptionText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsUploading(true)

    try {
      // For now, create a local URL for preview
      // In production, this would upload to Cloudinary
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage)
      setUploadedImage(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFrameDimensions = () => {
    const baseWidth = 200
    const baseHeight = 250

    switch (frameSize) {
      case "8x10":
        return { width: baseWidth, height: baseHeight }
      case "11x14":
        return { width: baseWidth * 1.1, height: baseHeight * 1.1 }
      case "16x20":
        return { width: baseWidth * 1.3, height: baseHeight * 1.3 }
      case "18x24":
        return { width: baseWidth * 1.4, height: baseHeight * 1.4 }
      case "24x36":
        return { width: baseWidth * 1.6, height: baseHeight * 1.6 }
      default:
        return { width: baseWidth, height: baseHeight }
    }
  }

  const frameDimensions = getFrameDimensions()

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Upload Your Photo</h3>

            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                    : "border-muted-foreground/25 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/10"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">Drop your image here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse your files</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-amber-700 hover:bg-amber-800"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 10MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded image"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button onClick={removeImage} size="sm" variant="destructive" className="absolute top-2 right-2">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Different Image
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Caption Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Add Caption (Optional)</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="caption">Caption Text</Label>
                <Textarea
                  id="caption"
                  placeholder="Add a meaningful caption to your photo..."
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Your caption will be elegantly displayed below your framed photo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 text-center">
              <div className="inline-block">
                {/* Frame */}
                <div
                  className="border-8 rounded-sm shadow-xl bg-white dark:bg-gray-100 p-2"
                  style={{
                    borderColor: frameStyle.color?.toLowerCase() || "#8B4513",
                    width: frameDimensions.width,
                    height: frameDimensions.height,
                  }}
                >
                  {/* Photo */}
                  <div
                    className="relative overflow-hidden rounded-sm"
                    style={{
                      width: frameDimensions.width - 32,
                      height: frameDimensions.height - 80,
                    }}
                  >
                    {uploadedImage ? (
                      <Image src={uploadedImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                        Your Photo Here
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  {captionText && (
                    <div className="mt-2 text-xs text-gray-700 dark:text-gray-600 text-center font-medium">
                      {captionText}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Frame:</span>
                <span className="font-medium">{frameStyle.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Size:</span>
                <span className="font-medium">{FRAME_SIZES[frameSize].label}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-amber-700 dark:text-amber-400">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Continue Button */}
            <Button asChild size="lg" className="w-full mt-6 bg-amber-700 hover:bg-amber-800" disabled={!uploadedImage}>
              <Link
                href={`/order/checkout?frame=${frameStyle.id}&size=${frameSize}&price=${totalPrice}&image=${encodeURIComponent(uploadedImage || "")}&caption=${encodeURIComponent(captionText)}`}
              >
                Continue to Checkout
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
