import { google } from "googleapis"

// abel am not sure about the type of this auth
export const getData = async (auth: any) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth })
  try {
    const res = await drive.files.list()
    const files = res.data.files

    console.log(files)
  } catch (error: any) {
    console.error("Error fetching files:", error.message)
    return null
  }
}