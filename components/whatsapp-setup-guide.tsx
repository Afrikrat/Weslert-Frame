import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export function WhatsAppSetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            WhatsApp Integration Setup
            <Badge variant="secondary">Admin Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              WhatsApp notifications are currently in development mode. Messages are logged to console. Follow the steps
              below to enable live notifications.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">1</span>
              </div>
              <div>
                <h4 className="font-medium">Create Meta Developer Account</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up at developers.facebook.com and create a new app with WhatsApp Business API
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">2</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Environment Variables</h4>
                <div className="text-sm text-muted-foreground space-y-1 mt-1">
                  <code className="bg-muted px-2 py-1 rounded text-xs block">ADMIN_WHATSAPP_NUMBER=+1234567890</code>
                  <code className="bg-muted px-2 py-1 rounded text-xs block">WHATSAPP_API_TOKEN=your_access_token</code>
                  <code className="bg-muted px-2 py-1 rounded text-xs block">
                    WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
                  </code>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">3</span>
              </div>
              <div>
                <h4 className="font-medium">Test Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Place a test order to verify notifications are working correctly
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Current Status</h4>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Notification system implemented</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm">API configuration needed for live notifications</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
