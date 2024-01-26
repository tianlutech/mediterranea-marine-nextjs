import axios from "axios"
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export async function sendWhatsAppBulkMessage(body: any) {
    console.log(">>>>>>>data", body)
//   const apiUrl = "https://graph.facebook.com/v18.0/178392938699880/messages"

//   const response = await axios.get(apiUrl);

//   if (response.data.error_message) {
//     return response.data.error_message;
//   }
//   const dataResponse = response.data.results[0].address_components;
  
//   // not sure about the component type
//   const zipCodeComponent = dataResponse.find((component: any) =>
//     component.types.includes("postal_code")
//   );
//   const zipcode = zipCodeComponent ? zipCodeComponent.long_name : "N/A";

//   if (zipcode === "N/A") {
//     return false
//   }
  return true;
}