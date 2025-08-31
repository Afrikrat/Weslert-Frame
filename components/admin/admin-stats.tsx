import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderWithFrameStyle } from "@/lib/types"
import { DollarSign, Package, Clock, CheckCircle } from "lucide-react"

interface AdminStatsProps {
  orders: OrderWithFrameStyle[]
  detailed?: boolean
}

export function AdminStats({ orders, detailed = false }: AdminStatsProps) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "completed").length

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {detailed && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["pending", "processing", "completed", "cancelled"].map((status) => {
                  const count = orders.filter((order) => order.status === status).length
                  const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0

                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["cash_on_delivery", "bank_transfer", "online_payment"].map((method) => {
                  const count = orders.filter((order) => order.payment_method === method).length
                  const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0
                  const label = method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())

                  return (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
