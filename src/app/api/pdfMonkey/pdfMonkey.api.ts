import { PDFMONKEY_DOCUMENT_ID } from "@/models/constants";
import { Booking, Boat, Captain, calculateArrivalTime } from "@/models/models";
import moment from "moment";
import { getFileContentBase64FromGoogleDrive } from "../googleDrive/googleDrive.api";
import axios from "axios";

const pdfMonkey_api_key = process.env.PDFMONKEY_API_KEY;

export async function createDocument(
  bookingInfo: Booking,
  boatDetails: Boat,
  captainDetails: Captain
) {
  try {
    const convertSignature = async (signature_url: string) => {
      try {
        // Fetch the image as a response stream
        const response = await axios.get(signature_url, {
          responseType: "arraybuffer", // Important to handle binary data correctly
        });

        // Convert the response data (buffer) to a base64 string
        const base64String = Buffer.from(response.data, "binary").toString(
          "base64"
        );

        return `data:image/png;base64,${base64String}`;
      } catch (error) {
        console.error("Error retrieving file from URL:", error);
        throw error; // Rethrow the error for further handling
      }
    };

    const captainSignature = await convertSignature(
      captainDetails.Signature[0].url
    );
    const customerSignature = await getFileContentBase64FromGoogleDrive(
      bookingInfo.CustomerSignature
    );

    const date = bookingInfo["Date"];
    const bookingDateYear = moment(date).format("YYYY");
    const bookingDateMonth = moment(date).format("MM");
    const bookingDateDay = moment(date).format("DD");
    const { Nombre, Code, RegistrationPlate, id } = boatDetails;
    const apiUrl = "https://api.pdfmonkey.io/api/v1/documents";
    const rentPrice = bookingInfo["RentPrice"] || 0;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${pdfMonkey_api_key}`,
      },
      body: JSON.stringify({
        document: {
          document_template_id: PDFMONKEY_DOCUMENT_ID,
          status: "pending",
          payload: {
            boatName: Nombre,
            boatCode: Code,
            boatRegistrationPlate: RegistrationPlate,
            basePort: "Ibiza",
            boatMaxPassenger: boatDetails["Max.Passengers"],
            bookingDepartureTime: bookingInfo["Departure Time"],
            bookingDateDay: bookingDateDay,
            bookingDateMonth: bookingDateMonth,
            bookingDateYear: bookingDateYear,
            customerName:
              `${bookingInfo["First Name"]} ` + `${bookingInfo["Last Name"]}`,
            customerAddress: bookingInfo["Billing Address"],
            customerId: bookingInfo["ID Number"],
            bookingDate: moment(bookingInfo["Date"]).format("DD/MM/YYYY"),
            boatFlag: "boatFlag",
            boatType: "Yacht",
            departureMaximumHour: calculateArrivalTime(
              bookingInfo["Departure Time"]
            ),
            PortOfDisembark: "Ibiza",
            MaximumNumberOfGuestCruisingOnBoard: boatDetails["Max.Passengers"],
            taxableBase: rentPrice,
            crew: boatDetails["Crew"],
            taxVAT: rentPrice * 0.21,
            TotalRentalRate: rentPrice + rentPrice * 0.21,
            DeliveryPort: "Ibiza port",
            CustomerSignature: `data:image/png;base64,${customerSignature}`,
            CaptainSignature: captainSignature,
          },
          meta: {
            clientId: "ABC1234-DE",
            clientName:
              `${bookingInfo["First Name"]} ` + `${bookingInfo["Last Name"]}`,
            clientEmail: bookingInfo.Email,
            boatId: id,
            captainId: `${captainDetails.id}`,
            _filename: `${bookingInfo["First Name"]} 
              ${bookingInfo["Last Name"]} - ${boatDetails.Nombre} - ${moment(
              bookingInfo.Date
            ).format("YYYY-MM-DD")} - contract`,
            NotionId: bookingInfo.id,
          },
        },
      }),
    });

    const res = await response.json();
    if (res.errors) {
      return { error: res.errors[0].detail };
    }
    return res;
  } catch (error: any) {
    console.error("Error while creating document", error.message);
    return { error: error.message };
  }
}
