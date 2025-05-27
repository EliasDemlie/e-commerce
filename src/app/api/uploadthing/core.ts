
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

/* eslint-disable @typescript-eslint/no-unused-vars */
const auth = (req: Request) => ({ id: "fakeId" });
/* eslint-enable @typescript-eslint/no-unused-vars */
export const ourFileRouter = {
  imageUploader: f({
    image: {

      maxFileSize: '8MB',

    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req)

      if (!user) throw new UploadThingError('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.ufsUrl)


     return {
       uploadedBy: metadata.userId,
       url: file.url ?? file.ufsUrl ?? `https://utfs.io/f/${file.key}`,
     }

    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
