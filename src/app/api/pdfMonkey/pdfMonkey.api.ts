import { PDFMONKEY_DOCUMENT_ID } from "@/models/constants";
import { Booking } from "@/models/models";

const pdfMonkey_api_key = process.env.PDFMONKEY_API_KEY

export async function createDocument(bookingInfo: Booking) {
  try {
    console.log(">>>>>>>bookingInfo", bookingInfo)
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
            boatName: "Super Client",
            boatCode: "AwesomeCorp",
            boatRegistrationPlate: "3 (three)",
            basePort:"Ibiza",
            boatMaxPassenger:"23",
            bookingDepartureTime:"12:30",
            bookingDateDay: "01",
            bookingDateMonth:"12",
            bookingDateYear:"34",
            customerName:"Chris Henry",
            bookingDate:"01/01/2024",
            registrationPort:"Ibiza 01",
            boatFlag:"boatFlag",
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
    console.log(">>>>>>>res")

    return res
  } 
  catch (error: any)
   {
    console.error("Error while creating document", error.message);
    return { error: error.message };
  }
}