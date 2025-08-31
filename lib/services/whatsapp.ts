interface WhatsAppMessage {
  to: string
  message: string
}

interface OrderNotificationData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  frameName: string
  frameSize: string
  totalPrice: number
  paymentMethod: string
  notes?: string
}

export function generateWhatsAppOrderMessage(data: OrderNotificationData): string {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    frameName,
    frameSize,
    totalPrice,
    paymentMethod,
    notes,
  } = data

  let message = `🖼️ *NEW FRAME ORDER*\n\n`
  message += `📋 *Order ID:* ${orderId.slice(0, 8)}\n`
  message += `👤 *Customer:* ${customerName}\n`
  message += `📧 *Email:* ${customerEmail}\n`
  message += `📱 *Phone:* ${customerPhone}\n\n`
  message += `🖼️ *Frame Details:*\n`
  message += `• Style: ${frameName}\n`
  message += `• Size: ${frameSize}\n`
  message += `• Price: GH₵${totalPrice.toFixed(2)}\n`
  message += `• Payment: ${formatPaymentMethod(paymentMethod)}\n\n`

  if (notes) {
    message += `📝 *Notes:* ${notes}\n\n`
  }

  message += `⏰ *Ordered:* ${new Date().toLocaleString()}\n\n`
  message += `Please confirm this order and let me know the expected completion time. Thank you!`

  return message
}

export function generateWhatsAppLink(phoneNumber = "233539210458", message: string): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, "")

  // Add Ghana country code if not present
  const formattedPhone = cleanPhone.startsWith("233") ? cleanPhone : `233${cleanPhone.replace(/^0/, "")}`

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)

  // Generate WhatsApp link
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "cash_on_delivery":
      return "Cash on Delivery"
    case "bank_transfer":
      return "Bank Transfer"
    case "online_payment":
      return "Online Payment"
    default:
      return method
  }
}

// Customer notification function
export async function sendCustomerWhatsAppConfirmation(data: {
  customerPhone: string
  customerName: string
  orderId: string
  frameName: string
  frameSize: string
  totalPrice: number
}): Promise<boolean> {
  try {
    const message =
      `Hello ${data.customerName}! 👋\n\n` +
      `Thank you for your custom frame order!\n\n` +
      `📋 *Order Details:*\n` +
      `• Order ID: ${data.orderId.slice(0, 8)}\n` +
      `• Frame: ${data.frameName}\n` +
      `• Size: ${data.frameSize}\n` +
      `• Total: GH₵${data.totalPrice.toFixed(2)}\n\n` +
      `We'll start working on your frame right away and will contact you when it's ready.\n\n` +
      `If you have any questions, feel free to reply to this message!`

    console.log("[Customer WhatsApp Confirmation]", {
      to: data.customerPhone,
      message: message,
      timestamp: new Date().toISOString(),
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return true
  } catch (error) {
    console.error("Customer WhatsApp confirmation failed:", error)
    return false
  }
}
