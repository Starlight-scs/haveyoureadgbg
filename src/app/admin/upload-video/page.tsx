"use client"

import { useState } from "react"

import { UploadButton } from "@/utils/uploadthing"

export default function UploadVideoPage() {
  const [videoUrl, setVideoUrl] = useState("")

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
            Upload a replacement for the oversized local video file. When the
            upload finishes, copy the returned URL into
            `NEXT_PUBLIC_HERO_VIDEO_URL` in `.env.local`.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <UploadButton
            endpoint="heroVideo"
            onClientUploadComplete={(files) => {
              const uploadedFile = files[0]

              if (uploadedFile?.ufsUrl) {
                setVideoUrl(uploadedFile.ufsUrl)
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
        </div>

        <div className="rounded-2xl border border-dashed border-border p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Uploaded video URL
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
