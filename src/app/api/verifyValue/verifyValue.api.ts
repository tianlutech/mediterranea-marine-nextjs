import { Client } from "@notionhq/client";
const notionSecret = process.env.NOTION_SECRET || undefined;
const MASTER_PIN = process.env.MASTER_PIN;
const notion = new Client({ auth: notionSecret });
export async function verifyValue({
  itemID,
  value,
  compareTo,
}: {
  itemID: string;
  value: string;
  compareTo: string;
}) {
  try {
    const response: any = await notion.pages.retrieve({
      page_id: itemID,
    });
    const captainPin = response.properties[
      compareTo
    ].rich_text[0].plain_text.replace(/\n/g, "");

    return { ok: captainPin === value };
  } catch (error: any) {
    console.error("Get Notion Page Error:", error.message);
    return { error: error.message };
  }
}

export async function verifyMasterValue(Pin: string) {
  return { ok: MASTER_PIN === Pin };
}
