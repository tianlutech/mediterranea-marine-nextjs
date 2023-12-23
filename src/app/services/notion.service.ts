import { Client } from "@notionhq/client";
import { Boat, Booking } from "../models/models";
import {
  parseNotionObject,
  NotionPage,
  parseObjectToNotion,
} from "../models/notion.model";
import { toast } from "react-toastify";

export async function getBoatInfo(boatId: string) {
  try {
    const response = await fetch(
      `/api/notion?id=${encodeURIComponent(boatId)}`
    );
    const json = await response.json();

    const boat = new Boat();
    return parseNotionObject<Boat>(boat, json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function getBookingInfo(bookingId: string) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion?id=${encodeURIComponent(bookingId)}`
    );

    const json = await response.json();

    const booking = new Booking();
    return parseNotionObject<Booking>(booking, json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}

export async function updateBookingInfo(bookingId: string, data: Booking) {
  try {
    // Append the bookingId as a query parameter to the URL
    const response = await fetch(
      `/api/notion?id=${encodeURIComponent(bookingId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: parseObjectToNotion(data),
        }),
      }
    );
    const json = await response.json();
    if (response.status !== 200) {
      toast.error("Something went wrong" + response.statusText);
      return false;
    }

    return parseNotionObject<Booking>(new Booking(), json.result as NotionPage);
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return undefined;
  }
}
