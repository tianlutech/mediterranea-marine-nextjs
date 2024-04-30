import {
  MAKE_SCENARIOS,
  MAKE_WEBHOOKS,
  RESEND_MESSAGE_MAKE_WEBHOOKS,
  DAVID_SEABOB_OFFER_MESSAGE_MAKE_WEBHOOKS,
} from "@/models/constants";
import { Booking, Boat, BookingFormData } from "@/models/models";
import moment from "moment";
import { extractIdFromGoogleDriveLink } from "./utils";

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

export async function sendMessageWebhook(
  bookingInfo: Booking,
  boatDetails: Boat
) {
  try {
    const idFront = bookingInfo["ID Front Picture"][0] as { name?: string };
    const idBack = bookingInfo["ID Back Picture"][0] as { name?: string };
    const amountPaid: string = (Booking.totalPayment(bookingInfo as any)).toString()

    const IdFrontImageId =
      idFront && idFront.name
        ? (await extractIdFromGoogleDriveLink(idFront.name)) || ""
        : "";
    const IdBackImageId =
      idBack && idBack.name
        ? (await extractIdFromGoogleDriveLink(idBack.name)) || ""
        : "";
    const documentsApproved = bookingInfo["DocumentsApproved"];
    const documentsApprovedString =
      documentsApproved !== undefined ? documentsApproved.toString() : "";

    const queryParams = new URLSearchParams({
      date: moment(bookingInfo.Date).format("DD/MM/YYYY"),
      id: bookingInfo.id.replace("-", ""),
      firstName: bookingInfo["First Name"],
      lastName: bookingInfo["Last Name"],
      customerEmail: bookingInfo.Email,
      boatName: boatDetails.Nombre,
      pricePerMile: (boatDetails.MilePrice ?? "0").toString() + " Euros",
      totalPassengers: (bookingInfo["Total Passengers"] ?? "0").toString(),
      noAdults: (bookingInfo["No Adults"] ?? "0").toString(),
      noChilds: (bookingInfo["No Childs"] ?? "0").toString(),
      DocumentsApproved: documentsApprovedString,
      IdFrontImageId,
      IdBackImageId,
      confirmedPayment: amountPaid
    }).toString();

    const res = await fetch(
      `${MAKE_WEBHOOKS.BOOKING_SUBMITTED}?${queryParams}`,
      {
        method: "GET",
      }
    );

    if (res.status !== 200) {
      return { error: (res.body as any).error };
    }

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function resendMessageWebhook(bookingInfo: Booking) {
  try {
    const documentsApproved = bookingInfo["DocumentsApproved"];
    const documentsApprovedString =
      documentsApproved !== undefined ? documentsApproved.toString() : "";

    const queryParams = new URLSearchParams({
      id: bookingInfo.id.replace("-", ""),
      firstName: bookingInfo["First Name"],
      lastName: bookingInfo["Last Name"],
      customerEmail: bookingInfo.Email,
      DocumentsApproved: documentsApprovedString,
    }).toString();

    const res = await fetch(
      `${RESEND_MESSAGE_MAKE_WEBHOOKS.BOOKING_SUBMITTED}?${queryParams}`,
      {
        method: "GET",
      }
    );

    if (res.status !== 200) {
      return { error: (res.body as any).error };
    }

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function sendDavidSeabobOfferMessageWebhook(bookingInfo: Booking) {
  try {
    const queryParams = new URLSearchParams({
      bookingId: bookingInfo.id.replace("-", ""),
      date: moment().toISOString(),
    }).toString();

    const res = await fetch(
      `${DAVID_SEABOB_OFFER_MESSAGE_MAKE_WEBHOOKS.BOOKING_SUBMITTED}?${queryParams}`,
      {
        method: "GET",
      }
    );

    if (res.status !== 200) {
      return { error: (res.body as any).error };
    }

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}
