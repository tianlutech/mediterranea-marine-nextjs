import { google, drive_v3 } from "googleapis";
import fs from "fs";
import { Readable } from "stream";

// abel am not sure about the type of this auth
export const uploadFile = async (auth: any, file: File) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const googleDriveFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID

    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [`${googleDriveFolderId}`]
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
    });
    return res.data
  } catch (error: any) {
    console.error("Error fetching files:", error.message);
    return null;
  }
};
