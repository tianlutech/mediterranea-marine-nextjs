import { Booking, Boat, Captian } from "@/models/models";

export async function createDocument(bookingInfo: Booking, boatDetails: Boat, captainDetails: Captian) {
  try {
    const response = await fetch(
      "/api/pdfMonkey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({bookingInfo, boatDetails, captainDetails})
      }
    );
    const res = await response.json();
    return res
  } catch (error) {
    console.error("Error while creating pdf", error);
    return undefined;
  }
}