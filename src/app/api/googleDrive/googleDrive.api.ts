import { google, drive_v3 } from "googleapis"
import fs from "fs"

// abel am not sure about the type of this auth
export const uploadFile = async (auth: any, file: File) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth })
  try {
    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type
      },
      media: {
        mimeType: file.type,
        body: fs.createReadStream(file.name),
      }
    });
    console.log(res.data);
  } catch (error: any) {
    console.error("Error fetching files:", error.message)
    return null
  }
}