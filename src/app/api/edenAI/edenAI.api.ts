import axios from "axios";

const edenAIApiKey = process.env.EDEN_API_KEY;

export async function validateImage(form: any) {
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/ocr/identity_parser",
    headers: {
      Authorization: `Bearer ${edenAIApiKey}`,
    },
    data: {
      providers: "microsoft,base64,amazon,mindee",
      file_url: "https://buyauthenticdocument.com/wp-content/uploads/2023/05/Buy-spanish-ID-982x620.jpg",
      fallback_providers: "",
    },
  };

  try {
    const response = await axios.request(options);

    console.log(response.data.amazon.extracted_data);
    return response.data;
  } catch (error: any) {
    console.error(">>> logged here",error);
    return { error: error.message };
  }
}
