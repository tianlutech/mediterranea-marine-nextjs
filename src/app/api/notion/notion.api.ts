import { Client } from "@notionhq/client";

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
  console.log("=======response", response)
  return response;
}

export async function updatePage(
  pageId: string,
  properties: Record<string, unknown>
) {
  const filteredNotionData = filterUndefinedProperties(properties);

  const page = await notion.pages.update({
    page_id: pageId,
    properties: filteredNotionData,
  });
  return page;
}

export function filterUndefinedProperties(obj: any) {
  const filteredObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] || obj[key]?.length) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
}
