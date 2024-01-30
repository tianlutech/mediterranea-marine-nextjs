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

export async function queryDatabase({
  databaseId,
  filter,
}: {
  databaseId: string;
  filter: Record<string, unknown>;
}) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filter as any, // Filter object is complex to define
    });
    return { result: response };
  } catch (error: any) {
    console.error("Query Database :", error.message);
    return { error: error.message };
  }
}

export async function createDatabaseItem({
  databaseId,
  properties,
}: {
  databaseId: string;
  properties: Record<string, unknown>;
}) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId, type: "database_id" },
      properties: properties as any,
    });
    return { result: response };
  } catch (error: any) {
    console.error("Create Item in Database :", error.message);
    return { error: error.message };
  }
}