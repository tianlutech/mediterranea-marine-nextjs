import { MAKE_SCENARIOS } from "@/models/constants";
import { Booking, Boat } from "@/models/models";
import moment from "moment";

export async function runSavePDFScenario() {
  try {
    const body = { scenarioId: MAKE_SCENARIOS.SAVE_PDF, data: {} };
    const response = await fetch("/api/make", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const res = await response.json();

    return res;
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function sendMessageWebhook(bookingInfo: Booking, boatDetails: Boat) {
  try {
    const queryParams = new URLSearchParams({
      date: moment(bookingInfo.Date).format("DD/MM/YY"),
      id: bookingInfo.id,
      firstName:bookingInfo["First Name"],
      lastName:bookingInfo["Last Name"],
      customerEmail: bookingInfo.Email,
      boatName: boatDetails.Nombre,
      pricePerMile: (boatDetails.MilePrice ?? "0").toString(),
      totalPassengers: (bookingInfo["Total Passengers"] ?? "0").toString(),
    }).toString();
    
    const res = await fetch(`https://hook.eu2.make.com/mkshx7rk3edsbzg55lty4ej77fwiukg1?${queryParams}`, {
      method: "GET",
    });

    if(res.status !== 200) {
      return false
    }

    return true;
  } catch (error) {
    console.error(error);
    return { error };
  }
}