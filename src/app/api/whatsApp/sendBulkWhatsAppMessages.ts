import axios from "axios";

const WHATAPP_URL = "https://graph.facebook.com/v19.0"

export async function sendWhatsAppBulkMessage(body: any) {
  try {
    console.log(">>>>>>>>>>>", body)

    return true;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return false;
  }
}
