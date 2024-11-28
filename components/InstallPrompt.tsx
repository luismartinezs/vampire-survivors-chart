"use client"
import { useEffect, useState } from "react"
import { Button } from "./ui/Button"

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null
  }

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm w-full mx-auto mb-4 border border-slate-700">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-slate-200">Install App</h3>
        {isIOS ? (
          <p className="text-sm text-slate-300">
            To install, tap the share button
            <span role="img" aria-label="share icon" className="mx-1">⎋</span>
            and then "Add to Home Screen"
            <span role="img" aria-label="plus icon" className="mx-1">➕</span>
          </p>
        ) : (
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => {}}
          >
            Add to Home Screen
          </Button>
        )}
      </div>
    </div>
  )
}