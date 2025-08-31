"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface OrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  frame_style_id: string
  frame_size: string
  image_url: string
  caption_text: string | null
  total_price: number
  payment_method: string
  notes: string | null
}

export async function submitOrder(orderData: OrderData) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("orders").insert([orderData]).select("id").single()

    if (error) {
      console.error("Database error:", error)
      return { success: false, error: "Failed to create order" }
    }

    console.log(`Order ${data.id} created successfully. Customer will send WhatsApp confirmation manually.`)

    // Revalidate the admin dashboard to show new order
    revalidatePath("/admin")

    return { success: true, orderId: data.id }
  } catch (error) {
    console.error("Order submission error:", error)
    return { success: false, error: "Failed to submit order" }
  }
}
