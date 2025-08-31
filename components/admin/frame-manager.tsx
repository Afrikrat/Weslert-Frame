"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, ImageIcon, Camera } from "lucide-react"
import Image from "next/image"
import type { FrameStyle } from "@/lib/types"
import { formatCurrency } from "@/lib/types"

interface FrameManagerProps {
  frameStyles: FrameStyle[]
  onUpdate?: () => void
}

export function FrameManager({ frameStyles, onUpdate }: FrameManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [mockupPreview, setMockupPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "frame" | "mockup") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "frame") {
          setPreviewImage(e.target?.result as string)
        } else {
          setMockupPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // Mock upload - in production, implement actual Cloudinary upload
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const handleAddFrame = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const supabase = createClient()

    try {
      let imageUrl = null
      let mockupUrl = null

      // Handle frame image upload
      const frameImageFile = (event.currentTarget.elements.namedItem("frame_image") as HTMLInputElement)?.files?.[0]
      if (frameImageFile) {
        imageUrl = await uploadImageToCloudinary(frameImageFile)
      }

      // Handle mockup image upload
      const mockupImageFile = (event.currentTarget.elements.namedItem("mockup_image") as HTMLInputElement)?.files?.[0]
      if (mockupImageFile) {
        mockupUrl = await uploadImageToCloudinary(mockupImageFile)
      }

      const { error } = await supabase.from("frame_styles").insert({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        base_price: Number.parseFloat(formData.get("base_price") as string),
        material: formData.get("material") as string,
        color: formData.get("color") as string,
        width_inches: formData.get("width_inches") ? Number.parseFloat(formData.get("width_inches") as string) : null,
        image_url: imageUrl,
        mockup_url: mockupUrl,
      })

      if (error) throw error

      setIsAddDialogOpen(false)
      setPreviewImage(null)
      setMockupPreview(null)
      onUpdate?.()
    } catch (error) {
      console.error("Error adding frame:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditFrame = (frame: FrameStyle) => {
    setSelectedFrame(frame)
    setPreviewImage(frame.image_url)
    setMockupPreview(frame.mockup_url)
    setIsEditDialogOpen(true)
  }

  const handleUpdateFrame = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedFrame) return

    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const supabase = createClient()

    try {
      let imageUrl = selectedFrame.image_url
      let mockupUrl = selectedFrame.mockup_url

      // Handle frame image upload
      const frameImageFile = (event.currentTarget.elements.namedItem("frame_image") as HTMLInputElement)?.files?.[0]
      if (frameImageFile) {
        imageUrl = await uploadImageToCloudinary(frameImageFile)
      }

      // Handle mockup image upload
      const mockupImageFile = (event.currentTarget.elements.namedItem("mockup_image") as HTMLInputElement)?.files?.[0]
      if (mockupImageFile) {
        mockupUrl = await uploadImageToCloudinary(mockupImageFile)
      }

      const { error } = await supabase
        .from("frame_styles")
        .update({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          base_price: Number.parseFloat(formData.get("base_price") as string),
          material: formData.get("material") as string,
          color: formData.get("color") as string,
          width_inches: formData.get("width_inches") ? Number.parseFloat(formData.get("width_inches") as string) : null,
          image_url: imageUrl,
          mockup_url: mockupUrl,
        })
        .eq("id", selectedFrame.id)

      if (error) throw error

      setIsEditDialogOpen(false)
      setSelectedFrame(null)
      setPreviewImage(null)
      setMockupPreview(null)
      onUpdate?.()
    } catch (error) {
      console.error("Error updating frame:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFrame = async (frameId: string) => {
    if (!confirm("Are you sure you want to delete this frame style?")) return

    const supabase = createClient()
    const { error } = await supabase.from("frame_styles").delete().eq("id", frameId)

    if (error) {
      console.error("Error deleting frame:", error)
    } else {
      onUpdate?.()
    }
  }

  const FrameForm = ({
    frame,
    onSubmit,
  }: { frame?: FrameStyle; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Frame Name</Label>
          <Input id="name" name="name" placeholder="Classic Oak Frame" defaultValue={frame?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="base_price">Base Price (GHS)</Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            placeholder="120.00"
            defaultValue={frame?.base_price}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Beautiful handcrafted oak frame perfect for family photos..."
          defaultValue={frame?.description || ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select name="material" defaultValue={frame?.material || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wood">Wood</SelectItem>
              <SelectItem value="Metal">Metal</SelectItem>
              <SelectItem value="Plastic">Plastic</SelectItem>
              <SelectItem value="Composite">Composite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" placeholder="Natural Oak" defaultValue={frame?.color || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width_inches">Width (inches)</Label>
          <Input
            id="width_inches"
            name="width_inches"
            type="number"
            step="0.25"
            placeholder="2.0"
            defaultValue={frame?.width_inches || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frame_image">Frame Image</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="frame_image"
                name="frame_image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "frame")}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            {previewImage && (
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image src={previewImage || "/placeholder.svg"} alt="Frame preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mockup_image">Realistic Mockup</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="mockup_image"
                name="mockup_image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "mockup")}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            {mockupPreview && (
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image src={mockupPreview || "/placeholder.svg"} alt="Mockup preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
            setPreviewImage(null)
            setMockupPreview(null)
          }}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={isLoading}>
          {isLoading ? "Saving..." : frame ? "Update Frame" : "Add Frame Style"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Frame Collection</h2>
          <p className="text-gray-600">Manage your frame styles and realistic mockup images</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-700 hover:bg-amber-800">
              <Plus className="h-4 w-4 mr-2" />
              Add New Frame
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Frame Style</DialogTitle>
            </DialogHeader>
            <FrameForm onSubmit={handleAddFrame} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Frame Style</DialogTitle>
          </DialogHeader>
          {selectedFrame && <FrameForm frame={selectedFrame} onSubmit={handleUpdateFrame} />}
        </DialogContent>
      </Dialog>

      {/* Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameStyles.map((frame) => (
          <Card key={frame.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {frame.mockup_url || frame.image_url ? (
                  <Image
                    src={frame.mockup_url || frame.image_url || "/placeholder.svg"}
                    alt={frame.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="w-32 h-24 border-4 rounded-sm shadow-md bg-white"
                      style={{ borderColor: frame.color?.toLowerCase() || "#8B4513" }}
                    >
                      <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => window.open(`/order?frame=${frame.id}`, "_blank")}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => handleEditFrame(frame)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteFrame(frame.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {frame.mockup_url && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      <Camera className="h-3 w-3 mr-1" />
                      Mockup
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{frame.name}</h3>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {formatCurrency(frame.base_price)}
                  </Badge>
                </div>
                {frame.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{frame.description}</p>}
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
                      {frame.width_inches}"
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {frameStyles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No frames yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Start building your frame collection by adding your first frame style.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-amber-700 hover:bg-amber-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Frame
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
