import { Client } from "@notionhq/client";
import { Boat, Booking } from "../models/models";
import { parseNotionObject, NotionPage } from "../models/notion.model";

export async function getBoatInfo(boatId: string) {
  try {
    const response = await fetch(`/api/notion?id=${encodeURIComponent(boatId)}`);
    const json = await response.json();
    console.log("=======boat", json)
    return parseNotionObject<Boat>(json as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getBookingInfo(bookingId: string) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(`/api/notion?id=${encodeURIComponent(bookingId)}`);

    const json = await response.json();
    return parseNotionObject<Booking>(json as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

