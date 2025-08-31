import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import MobileBottomNav from "@/components/mobile-bottom-nav"

export const metadata: Metadata = {
  title: "Westlert Frames - Custom Picture Framing",
  description: "Transform your cherished memories into beautiful wall art with our handcrafted custom frames",
  generator: "Westlert Frames",
  applicationName: "Westlert Frames",
  referrer: "origin-when-cross-origin",
  keywords: ["custom frames", "picture framing", "photo frames", "wall art", "handcrafted frames"],
  authors: [{ name: "Westlert Frames" }],
  creator: "Westlert Frames",
  publisher: "Westlert Frames",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://westlert-frames.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Westlert Frames - Custom Picture Framing",
    description: "Transform your cherished memories into beautiful wall art with our handcrafted custom frames",
    url: "https://westlert-frames.vercel.app",
    siteName: "Westlert Frames",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Westlert Frames - Custom Picture Framing",
    description: "Transform your cherished memories into beautiful wall art with our handcrafted custom frames",
    images: ["/logo.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#2D5016",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Westlert Frames",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Westlert Frames" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-background`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 pb-20">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <MobileBottomNav />
        </div>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
