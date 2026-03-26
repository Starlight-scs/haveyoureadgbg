import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const heroVideoConfigPath = path.join(
  process.cwd(),
  "src",
  "data",
  "hero-video.json"
)

type HeroVideoConfig = {
  url: string
}

export async function getHeroVideoUrl() {
  try {
    const fileContents = await readFile(heroVideoConfigPath, "utf8")
    const parsedConfig = JSON.parse(fileContents) as Partial<HeroVideoConfig>

    if (typeof parsedConfig.url === "string" && parsedConfig.url.length > 0) {
      return parsedConfig.url
    }
  } catch {}

  return process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? ""
}

export async function saveHeroVideoUrl(url: string) {
  await mkdir(path.dirname(heroVideoConfigPath), { recursive: true })
  await writeFile(
    heroVideoConfigPath,
    JSON.stringify({ url } satisfies HeroVideoConfig, null, 2) + "\n",
    "utf8"
  )
}
