import { PDFMONKEY_DOCUMENT_ID } from "@/models/constants";
import { Booking, Boat } from "@/models/models";
import moment from "moment";

const pdfMonkey_api_key = process.env.PDFMONKEY_API_KEY

export async function createDocument(bookingInfo: Booking, boatDetails: Boat) {
  try {
    console.log(">>>>>>>bookingInfo", bookingInfo)
    console.log(">>>>>>>boatDetails", boatDetails)
    const date = bookingInfo["Date"];
    const bookingDateYear = moment(date).format("YYYY");
    const bookingDateMonth = moment(date).format("MM");
    const bookingDateDay = moment(date).format("HH");
    const {Nombre, Code, RegistrationPlate} = boatDetails
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
            DeliveryPort:"Ibiza port"
          },
          meta: {
            clientId: "ABC1234-DE",
            _filename: "my-document.pdf"
          }
        }
      })
    });
    
    const res = await response.json();
    console.log(">>>>>>>res", res)

    return res
  } 
  catch (error: any)
   {
    console.error("Error while creating document", error.message);
    return { error: error.message };
  }
}