import { Client } from "@notionhq/client";
import { Boat, Booking } from "../models/models";
import { parseNotionObject, NotionPage } from "../models/notion.model";
import * as dotenv from "dotenv";

dotenv.config();

const notionDatabaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
const notionSecret = process.env.NEXT_PUBLIC_NOTION_SECRET;

console.log("Notion Database ID:", process.env.NEXT_PUBLIC_NOTION_DATABASE_ID);

if (!notionDatabaseId || !notionSecret) {
  throw new Error(
    "Missing required parameters notionDatabaseId or notionSecret"
  );
}

// Initialize a new client with the secret
const notion = new Client({ auth: notionSecret });

export async function getBoatInfo(boatId: string) {
  try {
    const response = await fetch("/api/notion/", {
      method: "POST",
      body: JSON.stringify({ id: boatId }),
    });
    const json = await response.json();
    return parseNotionObject<Boat>(json as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getBookingInfo(bookingId: string) {
  try {
    const response = await fetch("/api/notion/", {
      method: "POST",
      body: JSON.stringify({ id: bookingId }),
    });
    const json = await response.json();
    return parseNotionObject<Booking>(json as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}
