// PWA utilities and service worker registration
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[v0] SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("[v0] SW registration failed: ", registrationError)
        })
    })
  }
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
}

export function canInstallPWA(): boolean {
  if (typeof window === "undefined") return false
  return !isStandalone() && "serviceWorker" in navigator
}
