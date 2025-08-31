"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { OrdersTable } from "@/components/admin/orders-table"
import { AdminStats } from "@/components/admin/admin-stats"
import { FrameManager } from "@/components/admin/frame-manager"
import { AdminAuth } from "@/components/admin/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut, RefreshCw } from "lucide-react"
import type { OrderWithFrameStyle, FrameStyle } from "@/lib/types"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<OrderWithFrameStyle[]>([])
  const [frameStyles, setFrameStyles] = useState<FrameStyle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("admin-authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    const supabase = createClient()

    // Fetch orders with frame styles
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        frame_styles (*)
      `)
      .order("created_at", { ascending: false })

    // Fetch frame styles
    const { data: framesData, error: framesError } = await supabase
      .from("frame_styles")
      .select("*")
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error fetching orders:", ordersError)
    } else {
      setOrders((ordersData as OrderWithFrameStyle[]) || [])
    }

    if (framesError) {
      console.error("Error fetching frame styles:", framesError)
    } else {
      setFrameStyles(framesData || [])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5DEB3] to-[#DEB887]">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header with logout */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#8B4513]">Admin Dashboard</h1>
            <p className="text-[#A0522D]">Manage your Westlert Frames business</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="hidden md:flex bg-white border-[#8B4513] text-[#8B4513] hover:bg-[#F5DEB3]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 bg-white border-red-300 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-white shadow-sm border border-[#D2691E]">
            <TabsTrigger
              value="orders"
              className="text-xs md:text-sm data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="frames"
              className="text-xs md:text-sm data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]"
            >
              Frames
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-xs md:text-sm data-[state=active]:bg-[#8B4513] data-[state=active]:text-white text-[#8B4513]"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 md:space-y-6">
            <AdminStats orders={orders} />
            <Card className="shadow-sm border-[#D2691E]">
              <CardHeader className="bg-white">
                <CardTitle className="text-[#8B4513]">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <OrdersTable orders={orders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frames" className="space-y-4 md:space-y-6">
            <FrameManager frameStyles={frameStyles} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            <AdminStats orders={orders} detailed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
