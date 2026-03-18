import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const uploadRouter = {
  heroVideo: f({
    video: {
      maxFileCount: 1,
      maxFileSize: "256MB",
    },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return {
        name: file.name,
        url: file.ufsUrl,
      }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
