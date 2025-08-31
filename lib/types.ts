export interface FrameStyle {
  id: string
  name: string
  description: string | null
  base_price: number
  image_url: string | null
  material: string | null
  color: string | null
  width_inches: number | null
  mockup_url: string | null // Added mockup URL for realistic previews
  created_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  frame_style_id: string
  frame_size: string
  image_url: string
  caption_text: string | null
  total_price: number
  status: "pending" | "processing" | "completed" | "cancelled"
  payment_status: "pending" | "paid" | "failed"
  payment_method: string | null
  notes: string | null
  tracking_number: string | null // Added tracking number
  estimated_delivery: string | null // Added estimated delivery date
  created_at: string
  updated_at: string
}

export interface OrderWithFrameStyle extends Order {
  frame_styles: FrameStyle
}

export type FrameSize = "8x10" | "11x14" | "16x20" | "18x24" | "24x36"

export const FRAME_SIZES: Record<FrameSize, { label: string; multiplier: number }> = {
  "8x10": { label: '8" × 10"', multiplier: 1.0 },
  "11x14": { label: '11" × 14"', multiplier: 1.3 },
  "16x20": { label: '16" × 20"', multiplier: 1.8 },
  "18x24": { label: '18" × 24"', multiplier: 2.2 },
  "24x36": { label: '24" × 36"', multiplier: 3.0 },
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount)
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}
