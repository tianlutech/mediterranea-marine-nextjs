import axios from "axios"
const googleApiKey = process.env.GOOGLE_API_KEY;

export async function validateAddressZipCode(address: string) {
  console.log(">>>>>apikey", googleApiKey)
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${googleApiKey}`;

  const response = await axios.get(apiUrl);

  if (response.data.error_message) {
    return response.data.error_message;
  }
  const dataResponse = response.data.results[0].address_components;
  
  // not sure about the component type
  const zipCodeComponent = dataResponse.find((component: any) =>
    component.types.includes("postal_code")
  );
  const zipcode = zipCodeComponent ? zipCodeComponent.long_name : "N/A";

  if (zipcode === "N/A") {
    return false
  }
  return true;
}