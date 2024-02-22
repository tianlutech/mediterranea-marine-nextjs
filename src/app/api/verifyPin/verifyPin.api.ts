import axios from "axios"
import { Client } from "@notionhq/client";
const notionSecret = process.env.NOTION_SECRET || undefined;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const notion = new Client({ auth: notionSecret });

export async function verifyPin(captainId: string, Pin: string) {
  try {
    const response: any = await notion.pages.retrieve({
      page_id: captainId,
    });
    const captainPin = (response.properties["$Pin"].rich_text[0].plain_text).replace(/\n/g, "")

    if(captainPin !== Pin) {
      return false
    }
    
    return true;
  } catch (error: any) {
    console.error("Get Notion Page Error:", error.message);
    return { error: error.message };
  }
}