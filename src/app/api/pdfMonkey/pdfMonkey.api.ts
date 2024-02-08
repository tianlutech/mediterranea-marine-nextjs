import { PDFMONKEY_DOCUMENT_ID } from "@/models/constants";
import { Booking, Boat, Captian } from "@/models/models";
import moment from "moment";
import { getFileContentBase64FromGoogleDrive } from "../googleDrive/googleDrive.api"
import axios from "axios"

const pdfMonkey_api_key = process.env.PDFMONKEY_API_KEY

export async function createDocument(bookingInfo: Booking, boatDetails: Boat, captainDetails: any) {
  try {
    const convertCaptainSignature = async () => {
      try {
        // Fetch the image as a response stream
        const response = await axios.get(captainDetails.Signature[0].url, {
          responseType: "arraybuffer" // Important to handle binary data correctly
        });
    
        // Convert the response data (buffer) to a base64 string
        const base64String = Buffer.from(response.data, "binary").toString("base64");
        
        return base64String;
      } catch (error) {
        console.error("Error retrieving file from URL:", error);
        throw error; // Rethrow the error for further handling
      }
    };
    
    const captainSignature = await convertCaptainSignature()
    const customerSignature = await getFileContentBase64FromGoogleDrive(bookingInfo.CustomerSignature)

    const date = bookingInfo["Date"];
    const bookingDateYear = moment(date).format("YYYY");
    const bookingDateMonth = moment(date).format("MM");
    const bookingDateDay = moment(date).format("HH");
    const {Nombre, Code, RegistrationPlate, id} = boatDetails
    const apiUrl = "https://api.pdfmonkey.io/api/v1/documents"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pdfMonkey_api_key}`
      },
      body: JSON.stringify({
        document: {
          document_template_id: PDFMONKEY_DOCUMENT_ID,
          payload: {
            boatName: Nombre,
            boatCode: Code,
            boatRegistrationPlate: RegistrationPlate,
            basePort:"Ibiza",
            boatMaxPassenger: boatDetails["Max.Passengers"],
            bookingDepartureTime: bookingInfo["Departure Time"],
            bookingDateDay: bookingDateDay,
            bookingDateMonth:bookingDateMonth,
            bookingDateYear:bookingDateYear,
            customerName: `${bookingInfo["First Name"]} ` + `${bookingInfo["Last Name"]}`,
            bookingDate: moment(bookingInfo["SubmittedFormAt"]).format("DD/MM/YYYY"),
            registrationPort:"Ibiza 01",
            boatFlag: "boatFlag",
            boatType:"Yatch",
            departureMaximumHour:"21:30",
            PortOfDisembark:"Ibiza",
            MaximumNumberOfGuestCruisingOnBoard:"4",
            CrewComposedOfCaptain:"5",
            taxableBase:"233",
            taxVAT:"18",
            TotalRentalRate:"43",
            DeliveryPort:"Ibiza port",
            CustomerSignature: `data:image/png;base64,${customerSignature}`,
            CaptainSignature: `data:image/png;base64,${captainSignature}`
          },
          meta: {
            clientId: "ABC1234-DE",
            clientName: `${bookingInfo["First Name"]} ` + `${bookingInfo["Last Name"]}`,
            boatId: id,
            captainId: `${bookingInfo["First Name"]}`,
            _filename: "my-document.pdf",
            NotionId: `${bookingInfo.notion_id}`,
          }
        }
      })
    });
    
    const res = await response.json();
    return res
  } 
  catch (error: any)
   {
    console.error("Error while creating document", error.message);
    return { error: error.message };
  }
}