import { Booking } from "@/models/models";

export async function createDocument(bookingInfo: Booking) {
  try {
    const response = await fetch(
      "/api/pdfMonkey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingInfo)
      }
    );
    const res = await response.json();
    return res
  } catch (error) {
    console.error("Error while creating pdf", error);
    return undefined;
  }
}