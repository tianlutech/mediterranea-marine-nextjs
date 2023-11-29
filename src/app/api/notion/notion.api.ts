import { Client } from "@notionhq/client";
import { Boat, Booking } from "../models/models";
import { parseNotionObject, NotionPage } from "../models/notion.model";
import * as dotenv from "dotenv";

dotenv.config();

const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

console.log("Notion Database ID:", process.env.NEXT_PUBLIC_NOTION_DATABASE_ID);

if (!notionDatabaseId || !notionSecret) {
  throw new Error(
    "Missing required parameters notionDatabaseId or notionSecret"
  );
}

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
