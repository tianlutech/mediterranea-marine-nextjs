import { google } from "googleapis"
import * as googleDrive from "./googleDrive.api"

const auth = new google.auth.GoogleAuth({
  // your credentials to authenticate
  keyFile: process.cwd() + "@/app/config/credentials.json",
  // the actions you are permissed to perform using this API, in this case
  // all CRUD operations are permissed, check out
  // [ https://developers.google.com/drive/api/guides/api-specific-auth ]
  // for more advice on scopes
  scopes: ["https://www.googleapis.com/auth/drive"],
})

export async function GET(request: Request) {
  try {
    const result = await googleDrive.getData(auth); // Make sure getPage is an async function or remove await
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}