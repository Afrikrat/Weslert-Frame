"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Database error:", error)
      return { success: false, error: "Failed to update order status" }
    }

    // Revalidate the admin page to show updated status
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Update order status error:", error)
    return { success: false, error: "Failed to update order status" }
  }
}
