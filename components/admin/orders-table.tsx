"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import type { OrderWithFrameStyle } from "@/lib/types"
import { FRAME_SIZES } from "@/lib/types"
import { updateOrderStatus } from "@/lib/actions/admin"
import { Eye, Phone, Mail } from "lucide-react"
import Image from "next/image"

interface OrdersTableProps {
  orders: OrderWithFrameStyle[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithFrameStyle | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (!result.success) {
        alert(result.error || "Failed to update order status")
      }
      // The page will revalidate automatically due to server action
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update order status")
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Frame</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">#{order.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.frame_styles.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {FRAME_SIZES[order.frame_size as keyof typeof FRAME_SIZES]?.label}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">${order.total_price.toFixed(2)}</TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && <OrderDetailsModal order={selectedOrder} />}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function OrderDetailsModal({ order }: { order: OrderWithFrameStyle }) {
  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Customer Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Name:</span>
              <span>{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{order.customer_email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{order.customer_phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Order Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Order ID:</span> #{order.id.slice(0, 8)}
              </div>
              <div>
                <span className="font-medium">Frame:</span> {order.frame_styles.name}
              </div>
              <div>
                <span className="font-medium">Size:</span>{" "}
                {FRAME_SIZES[order.frame_size as keyof typeof FRAME_SIZES]?.label}
              </div>
              <div>
                <span className="font-medium">Material:</span> {order.frame_styles.material}
              </div>
              <div>
                <span className="font-medium">Color:</span> {order.frame_styles.color}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Total Price:</span> ${order.total_price.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Payment Method:</span> {order.payment_method?.replace("_", " ")}
              </div>
              <div>
                <span className="font-medium">Status:</span> {order.status}
              </div>
              <div>
                <span className="font-medium">Payment Status:</span> {order.payment_status}
              </div>
              <div>
                <span className="font-medium">Order Date:</span> {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {order.image_url && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Customer Image</h3>
            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={order.image_url || "/placeholder.svg"}
                alt="Customer uploaded image"
                fill
                className="object-contain"
              />
            </div>
            {order.caption_text && (
              <div className="mt-2">
                <span className="font-medium">Caption:</span> {order.caption_text}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Customer Notes</h3>
            <p className="text-sm">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
