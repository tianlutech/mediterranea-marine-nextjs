import { Booking, Boat, Captain } from "@/models/models";

export async function createDocument(bookingInfo: Booking, boatDetails: Boat, captainDetails: Captain) {
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