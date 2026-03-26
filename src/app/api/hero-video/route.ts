import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { getHeroVideoUrl, saveHeroVideoUrl } from "@/lib/hero-video"

export async function GET() {
  const url = await getHeroVideoUrl()

  return NextResponse.json({ url })
}

export async function POST(request: Request) {
  const body = (await request.json()) as { url?: unknown }
  const url = typeof body.url === "string" ? body.url.trim() : ""

  if (!url) {
    return NextResponse.json(
      { error: "A video URL is required." },
      { status: 400 }
    )
  }

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: "The video URL is invalid." }, { status: 400 })
  }

  await saveHeroVideoUrl(url)
  revalidatePath("/")
  revalidatePath("/admin/upload-video")

  return NextResponse.json({ ok: true, url })
}
