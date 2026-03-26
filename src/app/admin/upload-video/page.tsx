"use client"

import { useEffect, useState } from "react"

import { UploadButton } from "@/utils/uploadthing"

export default function UploadVideoPage() {
  const [videoUrl, setVideoUrl] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadCurrentVideoUrl() {
      try {
        const response = await fetch("/api/hero-video")

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { url?: string }

        if (data.url) {
          setVideoUrl(data.url)
          setStatusMessage("Showing the current landing page video.")
        }
      } catch {}
    }

    void loadCurrentVideoUrl()
  }, [])

  async function persistVideoUrl(url: string) {
    setIsSaving(true)
    setStatusMessage("Saving video for the landing page...")

    try {
      const response = await fetch("/api/hero-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error ?? "Failed to save the video URL.")
      }

      setStatusMessage("Landing page video updated.")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save the video URL."
      setStatusMessage(message)
      window.alert(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            UploadThing
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Upload the hero video
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Upload a replacement for the hero video. When the upload finishes,
            this page will save the hosted URL and update the landing page to
            use it.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <UploadButton
            endpoint="heroVideo"
            onClientUploadComplete={async (files) => {
              const uploadedFile = files[0]

              if (uploadedFile?.ufsUrl) {
                setVideoUrl(uploadedFile.ufsUrl)
                await persistVideoUrl(uploadedFile.ufsUrl)
              }
            }}
            onUploadError={(error: Error) => {
              window.alert(error.message)
            }}
            appearance={{
              button:
                "ut-ready:bg-primary ut-ready:text-primary-foreground ut-uploading:cursor-not-allowed rounded-full px-6 py-3 font-semibold",
              allowedContent: "text-sm text-muted-foreground",
            }}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            {isSaving ? "Saving..." : statusMessage || "Waiting for upload."}
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-border p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Active video URL
          </p>
          <p className="mt-3 break-all font-mono text-sm">
            {videoUrl || "Upload a video to generate a hosted URL."}
          </p>
        </div>

        {videoUrl ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
            <video
              className="aspect-video w-full object-cover"
              src={videoUrl}
              controls
              playsInline
            />
          </div>
        ) : null}
      </div>
    </main>
  )
}
