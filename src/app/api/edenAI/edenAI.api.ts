import axios from "axios";

const edenAIApiKey = process.env.EDEN_API_KEY;

export async function validateImage(file: Blob) {

  const requiredFields = [
    ["last_name", 0.8],
    ["given_names", 0.8],
    ["birth_date", 0.8],
    ["document_id", 0.8],
    ["document_type", 0.8],
];

  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/ocr/identity_parser",
    headers: {
      Authorization: `Bearer ${edenAIApiKey}`,
    },
    data: {
      providers: "microsoft",
      file_url: "https://www.nyc.gov/assets/idnyc/images/content/about/idnyc_front.jpg",
      fallback_providers: "",
    },
  };

  try {
    const response = await axios.request(options);
    const documentData = response.data.microsoft.extracted_data[0]

    for (const [field, threshold] of requiredFields) {
      if (documentData[field] && documentData[field].confidence && documentData[field].confidence >= threshold) {
          continue;
      } else {
          return false;
      }
  }
  return true;
  } catch (error: any) {
    return { error: error.message };
  }
}