import { google } from "googleapis";
import moment from "moment";
import { Readable } from "stream";
import { FileBody } from "@/models/models";
import path from "path";
import { credentials } from "../config/credentials";
import * as Sentry from "@sentry/nextjs";

const auth = new google.auth.GoogleAuth({
  // your credentials to authenticate
  // keyFile: process.cwd() + "/src/app/config/credentials.json",
  credentials: credentials,
  // the actions you are permissed to perform using this API, in this case
  // all CRUD operations are permissed, check out
  // [ https://developers.google.com/drive/api/guides/api-specific-auth ]
  // for more advice on scopes
  scopes: ["https://www.googleapis.com/auth/drive"],
});

export const uploadFile = async (file: File, body: FileBody) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const { boatName, id, slag, date } = body;

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

export const uploadReceiptImage = async (file: File, body: FileBody) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = "1isbXrWgy5MZ0oZ_UKwOW2hsYyANQejNm";
    const { date } = body;

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

export const uploadSignatureImage = async (file: File, body: FileBody) => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const googleDriveFolderId = "1welC1ONHo-T2-U1fYQvm5P3fKXrQvA9L";
    const { date } = body;

    const res = await drive.files.create({
      requestBody: {
        name: `${date}_${file.name}.png`,
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

export const getFileContentBase64FromGoogleDrive = async (fileUrl: string) => {
  const drive = google.drive({ version: "v3", auth });

  const extractFileIdFromGoogleDriveUrl = (fileUrl: string) => {
    // Regular expression to match the file ID in the Google Drive URL
    const regex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = fileUrl.match(regex);
  
    // match[1] contains the captured group if the URL matches the pattern
    return match ? match[1] : null;
  }

  const fileId = extractFileIdFromGoogleDriveUrl(fileUrl)
  
  if(!fileId) {
    return
  }

  try {
    const response = await drive.files.get({
      fileId,
      alt: "media",
    }, {
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      let chunks: Uint8Array[] = [];
      response.data
        .on("data", chunk => chunks.push(chunk))
        .on("end", () => {
          const buffer = Buffer.concat(chunks);
          const base64String = buffer.toString("base64");
          resolve(base64String);
        })
        .on("error", err => {
          console.error("Error fetching file content:", err);
          reject(err);
        });
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error retrieving file from Google Drive:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const uploadBill = async (file: File, body: any) => {
  const drive = google.drive({ version: "v3", auth });
  try {
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const googleDriveFolderId = "1_hOtlZT1WOfaEQVB5P9l3jXhdAOd0dzY";
    const { date, boatName, slag } = body;
    const fileName = `${boatName}-${date}-${slag}`;
    const res = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: file.type,
        parents: [googleDriveFolderId],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
    });

    // Return uploaded file data
    return res.data;
  } catch (error: any) {
    console.error("Error uploading PDF:", error.message);
    return { error: error.message };
  }
};