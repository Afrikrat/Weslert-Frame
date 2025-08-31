// WhatsApp configuration and setup instructions

export const WHATSAPP_CONFIG = {
  // Environment variables needed for WhatsApp integration
  ADMIN_WHATSAPP_NUMBER: process.env.ADMIN_WHATSAPP_NUMBER || "+1234567890",

  // WhatsApp Business API configuration (for production)
  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
}

/*
SETUP INSTRUCTIONS FOR WHATSAPP INTEGRATION:

1. WhatsApp Business API Setup:
   - Create a Meta Developer account
   - Set up WhatsApp Business API
   - Get Phone Number ID and Access Token
   - Add webhook URL for receiving messages

2. Environment Variables to Add:
   - ADMIN_WHATSAPP_NUMBER=+1234567890 (admin's WhatsApp number)
   - WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   - WHATSAPP_API_TOKEN=your_access_token
   - WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

3. Alternative Services:
   - Twilio WhatsApp API
   - 360Dialog
   - ChatAPI
   - WhatsApp Business Platform

4. For Testing:
   - Current implementation logs messages to console
   - In production, replace with actual API calls
   - Test with WhatsApp Business API sandbox first

5. Message Templates:
   - Create approved message templates in Meta Business Manager
   - Use template IDs for automated messages
   - Follow WhatsApp messaging policies
*/

// Example production implementation function
export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  if (!WHATSAPP_CONFIG.WHATSAPP_API_TOKEN || !WHATSAPP_CONFIG.WHATSAPP_PHONE_NUMBER_ID) {
    console.log("WhatsApp API not configured, message logged:", { to, message })
    return true
  }

  try {
    const response = await fetch(
      `${WHATSAPP_CONFIG.WHATSAPP_API_URL}/${WHATSAPP_CONFIG.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_CONFIG.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/[^\d]/g, ""), // Remove non-digits
          type: "text",
          text: {
            body: message,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("WhatsApp API error:", error)
    return false
  }
}
