import { Client } from "@notionhq/client";
import { parseObjectToNotion } from "@/app/models/notion.model";
import { UpdatePageParameters } from "@notionhq/client/build/src/api-endpoints";
const notionSecret = process.env.NOTION_SECRET || undefined;

// if (!notionSecret) {
//   throw new Error(
//     "Missing required parameters notionSecret"
//   );
// }

// Initialize a new client with the secret
const notion = new Client({ auth: notionSecret });

export async function getPage(pageId: string) {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });
    return { result: response };
  } catch (error: any) {
    console.error("Get Notion Page Error:", error.message);
    return { error: error.message };
  }
}

export async function updatePage(
  pageId: string,
  properties: Record<string, any>
) {
  try {
    const page = await notion.pages.update({
      page_id: pageId,
      properties,
    });
    return { result: page };
  } catch (error: any) {
    console.error("Get Notion Page Error:", error.message);
    return { error: error.message };
  }
}
