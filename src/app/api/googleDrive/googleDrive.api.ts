import { google } from "googleapis";
import moment from "moment";
import { Readable } from "stream";
import { FileBody } from "@/models/models";
import path from "path";

export const uploadFile = async (auth: any, file: File, body: FileBody) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const date = moment(Date.now()).format("DD-MM-YYYY");
    const { boatName, id, slag } = body;

    /**
     * Follow this to check if a folder exists then no need to create it again
     *  https://stackoverflow.com/questions/45757635/google-drive-api-v3-get-a-folder-id-with-name
     *  Meanwhile we keep a flat structure
     */

    // const fileMetadata: FileMetadata = {
    //   name: `${boatName}/${date}/${id}_${slag}`,
    //   mimeType: "application/vnd.google-apps.folder",
    //   parents: [`${googleDriveFolderId}`],
    // };

    // const folder = await drive.files.create({
    //   requestBody: fileMetadata,
    //   fields: "id",
    // });

    // if (!folder.data.id) {
    //   return { error: "Error creating the folder" };
    // }

    const res = await drive.files.create({
      requestBody: {
        name: `${boatName}_${date}_${id}_${slag}.${path.extname(file.name)}`,
        mimeType: file.type,
        // parents: [`${folder.data.id}`],
        parents: [`${googleDriveFolderId}`],
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

export const uploadReceiptImage = async (auth: any, file: File) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = "1isbXrWgy5MZ0oZ_UKwOW2hsYyANQejNm";
    const date = moment(Date.now()).format("DD-MM-YYYY");

    const res = await drive.files.create({
      requestBody: {
        name: `${date}_${file.name}.${path.extname(file.name)}`,
        mimeType: file.type,
        // parents: [`${folder.data.id}`],
        parents: [`${googleDriveFolderId}`],
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

export const uploadSignatureImage = async (auth: any, file: File) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = "1welC1ONHo-T2-U1fYQvm5P3fKXrQvA9L";
    const date = moment(Date.now()).format("DD-MM-YYYY");

    const res = await drive.files.create({
      requestBody: {
        name: `${date}_${file.name}.${path.extname(file.name)}`,
        mimeType: file.type,
        // parents: [`${folder.data.id}`],
        parents: [`${googleDriveFolderId}`],
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
