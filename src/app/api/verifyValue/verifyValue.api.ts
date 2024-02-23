import { Client } from "@notionhq/client";
const notionSecret = process.env.NOTION_SECRET || undefined;
const masterPin = process.env.MASTER_PIN;
const notion = new Client({ auth: notionSecret });
export async function verifyValue(itemID: string, value: string, compareTo: string) {
  try {
    const response: any = await notion.pages.retrieve({
      page_id: itemID,
    });
    const captainPin = (response.properties[compareTo].rich_text[0].plain_text).replace(/\n/g, "")

    if(captainPin !== value) {
      return false
    }
    
    return true;
  } catch (error: any) {
    console.error("Get Notion Page Error:", error.message);
    return { error: error.message };
  }
}

export async function verifyMasterValue(Pin: string) {
  try {
    if(masterPin !== Pin) {
      return false
    }
    return true;
  } catch (error: any) {
    console.error("There has been an error:", error.message);
    return { error: error.message };
  }
}