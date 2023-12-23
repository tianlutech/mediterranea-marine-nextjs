import { google } from "googleapis";
import moment from "moment";
import fs from "fs";
import { Readable } from "stream";
import { FileBody } from "@/app/models/models";
import { FileMetadata } from "@/app/models/models";

// abel am not sure about the type of this auth
export const uploadFile = async (auth: any, file: File, body: FileBody) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const date = moment(Date.now()).format("DD-MM-YYYY");
    const { boatName, id, slag } = body;

    const fileMetadata: FileMetadata = {
      name: `${boatName}/${date}/${id}_${slag}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [`${googleDriveFolderId}`],
    };
    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });

    if (!folder.data.id) {
      return { error: "Error creating the folder" };
    }

    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [`${folder.data.id}`],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching files:", error.message);
    return { error: error.message };
  }
};
