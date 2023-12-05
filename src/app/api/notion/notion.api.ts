import { Client } from "@notionhq/client";
import { parseObjectToNotion } from "@/app/models/notion.model";
const notionSecret = process.env.NOTION_SECRET || undefined;

// if (!notionSecret) {
//   throw new Error(
//     "Missing required parameters notionSecret"
//   );
// }

// Initialize a new client with the secret
const notion = new Client({ auth: notionSecret });

export async function getPage(pageId: string) {
  const response = await notion.pages.retrieve({
    page_id: pageId,
  });
  return response;
}

export async function updatePage(
  pageId: string,
  properties: Record<string, unknown>
) {
  const page = await notion.pages.update({
    page_id: pageId,
    properties,
  });
  return page;
}
