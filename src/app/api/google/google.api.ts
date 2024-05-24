import axios from "axios";
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export async function validateAddressZipCode(address: string) {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${googleApiKey}`;

  const response = await axios.get(apiUrl);

  if (response.data.error_message) {
    return response.data.error_message;
  }
  const dataResponse = response.data.results[0].address_components;
  // not sure about the component type
  const requiredComponent = dataResponse.find((component: any) =>
    component.types.includes("street_number")
  );

  if (!requiredComponent?.long_name) {
    return false;
  }
  return true;
}
